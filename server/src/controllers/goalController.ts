import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.js";
import { Goal } from "../models/Goal.js";

const goalSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(2000).optional(),
  category: z.enum([
    "Career",
    "Health",
    "Finance",
    "Education",
    "Personal Growth",
  ]),
  deadline: z.coerce.date().optional(),
});

export async function listGoals(req: AuthRequest, res: Response) {
  const goals = await Goal.find({ userId: req.userId }).sort({
    createdAt: -1,
  });

  res.json(goals);
}

export async function createGoal(req: AuthRequest, res: Response) {
  const parsed = goalSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid goal data" });
    return;
  }

  const goal = await Goal.create({
    ...parsed.data,
    userId: req.userId,
  });

  res.status(201).json(goal);
}

export async function updateGoal(req: AuthRequest, res: Response) {
  const updates = z
    .object({
      title: z.string().trim().min(1).max(120).optional(),
      description: z.string().max(2000).optional(),
      category: goalSchema.shape.category.optional(),
      deadline: z.coerce.date().optional(),
      progress: z.number().min(0).max(100).optional(),
      status: z.enum(["active", "completed", "paused"]).optional(),
    })
    .safeParse(req.body);

  if (!updates.success) {
    res.status(400).json({ message: "Invalid goal update" });
    return;
  }

  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    updates.data,
    { new: true, runValidators: true }
  );

  if (!goal) {
    res.status(404).json({ message: "Goal not found" });
    return;
  }

  res.json(goal);
}

export async function deleteGoal(req: AuthRequest, res: Response) {
  const goal = await Goal.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!goal) {
    res.status(404).json({ message: "Goal not found" });
    return;
  }

  res.status(204).send();
}