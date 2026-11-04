import { Router } from "express";
import {
  listHabits,
  createHabit,
  deleteHabit,
} from "../controllers/habitController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listHabits);
router.post("/", createHabit);
router.delete("/:id", deleteHabit);

export default router;