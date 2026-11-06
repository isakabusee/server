import { Router } from "express";

import {
  completeHabit,
  getHabitLogs,
} from "../controllers/habitLogController.js";

import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post("/:habitId/complete", completeHabit);
router.get("/:habitId/logs", getHabitLogs);

export default router;