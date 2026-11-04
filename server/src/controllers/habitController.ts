import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.js";
import { Habit } from "../models/Habit.js";

const habitSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(1000).optional(),
  frequency: z.enum(["daily", "weekly"]).default("daily"),
  targetPerWeek: z.number().int().min(1).max(7).default(7),
});

export async function listHabits(req: AuthRequest, res: Response) {
  const habits = await Habit.find({ userId: req.userId }).sort({
    createdAt: -1,
  });

  res.json(habits);
}

export async function createHabit(req: AuthRequest, res: Response) {
  const parsed = habitSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid habit data" });
    return;
  }

  const habit = await Habit.create({
    ...parsed.data,
    userId: req.userId,
  });

  res.status(201).json(habit);
}

export async function deleteHabit(req: AuthRequest, res: Response) {
  const habit = await Habit.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!habit) {
    res.status(404).json({ message: "Habit not found" });
    return;
  }

  res.status(204).send();
}