import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/assistant", assistantRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;