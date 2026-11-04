
import { Request, Response } from "express";
import { Readable } from "node:stream";
import { UIMessage } from "ai";

import { createCoachResponse } from "../services/aiCoach";

import Goal from "../models/Goal";
import Habit from "../models/Habit";
import HabitLog from "../models/HabitLog";
import User from "../models/User";

export const chatWithCoach = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { messages } = req.body as {
      messages: UIMessage[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        message: "A conversation message is required",
      });
      return;
    }

    if (messages.length > 30) {
      res.status(400).json({
        message: "Conversation is too long",
      });
      return;
    }

    // User ID comes from authentication middleware.
    const userId = req.user.id;

    const user = await User.findById(userId).select("name");

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Retrieve the user's active goals.
    const goals = await Goal.find({
      userId,
      status: "active",
    }).select("title category progress deadline").lean();

    // Retrieve active habits.
    const habits = await Habit.find({
      userId,
      isActive: true,
    }).select("title targetPerWeek").lean();

    // Retrieve this week's habit completions.
    const habitLogs = await HabitLog.find({
      userId,
      completedAt: { $gte: sevenDaysAgo },
    }).select("habitId completedAt").lean();

    const weeklyTarget = habits.reduce(
      (total, habit) => total + (habit.targetPerWeek || 7),
      0
    );

    const weeklyCompletionRate = weeklyTarget > 0
      ? Math.round((habitLogs.length / weeklyTarget) * 100)
      : 0;

    const context = {
      userName: user.name,
      activeGoals: goals.map((goal) => ({
        title: goal.title,
        category: goal.category,
        progress: goal.progress,
        deadline: goal.deadline.toISOString(),
      })),
      habits: habits.map((habit) => ({
        title: habit.title,
        completedThisWeek: habitLogs.filter(
          (log) => log.habitId.toString() === habit._id.toString()
        ).length,
        targetPerWeek: habit.targetPerWeek || 7,
      })),
      weeklyCompletionRate,
    };

    const result = await createCoachResponse(
      messages,
      context
    );

    // Convert the AI SDK Web Response stream to an Express stream.
    const streamResponse = result.toUIMessageStreamResponse();

    res.status(200);

    streamResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (!streamResponse.body) {
      res.end();
      return;
    }

    Readable.fromWeb(streamResponse.body as any).pipe(res);
  } catch (error) {
    console.error("AI Coach Error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Unable to generate an AI response",
      });
    } else {
      res.end();
    }
  }
};
