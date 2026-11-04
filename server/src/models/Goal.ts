import { Schema, model } from "mongoose";

const goalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Career", "Health", "Finance", "Education", "Personal Growth"],
      required: true,
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Goal = model("Goal", goalSchema);