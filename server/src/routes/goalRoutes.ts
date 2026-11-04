import { Router } from "express";
import {
  listGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listGoals);
router.post("/", createGoal);
router.patch("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;