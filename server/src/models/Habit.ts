import { Schema, model } from "mongoose";

const habitSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    targetPerWeek: { type: Number, min: 1, max: 7, default: 7 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Habit = model("Habit", habitSchema);