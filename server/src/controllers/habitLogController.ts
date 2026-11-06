import type { Response } from "express";
import { z } from "zod";

import type { AuthRequest } from "../middleware/auth.js";
import { Habit } from "../models/Habit.js";
import { HabitLog } from "../models/HabitLog.js";

const completionSchema = z.object({
  dayKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().max(500).optional(),
});

export async function completeHabit(req: AuthRequest, res: Response) {
  const parsed = completionSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid completion data" });
    return;
  }

  const habit = await Habit.findOne({
    _id: req.params.habitId,
    userId: req.userId,
    isActive: true,
  });

  if (!habit) {
    res.status(404).json({ message: "Habit not found" });
    return;
  }

  try {
    const log = await HabitLog.create({
      userId: req.userId,
      habitId: habit._id,
      dayKey: parsed.data.dayKey,
      note: parsed.data.note ?? "",
    });

    res.status(201).json({
      message: "Habit completed successfully",
      log,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        message: "Habit already completed for this day",
      });
      return;
    }

    throw error;
  }
}

export async function getHabitLogs(req: AuthRequest, res: Response) {
  const habit = await Habit.findOne({
    _id: req.params.habitId,
    userId: req.userId,
  });

  if (!habit) {
    res.status(404).json({ message: "Habit not found" });
    return;
  }

  const logs = await HabitLog.find({
    userId: req.userId,
    habitId: habit._id,
  }).sort({ completedAt: -1 });

  res.json(logs);
}