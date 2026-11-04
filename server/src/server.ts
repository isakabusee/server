import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = Number(process.env.PORT) || 5000;

async function start() {
  await connectDB();

  app.listen(port, "0.0.0.0", () => {
    console.log(`GrowthTrack API running on port ${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});