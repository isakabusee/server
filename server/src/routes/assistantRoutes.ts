
import { Router } from "express";
import { chatWithCoach } from "../controllers/assistantController";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/chat", protect, chatWithCoach);

export default router;
