import { Schema, model } from "mongoose";

const habitLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    habitId: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },

    dayKey: {
      type: String,
      required: true,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },

    note: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true }
);

habitLogSchema.index(
  { userId: 1, habitId: 1, dayKey: 1 },
  { unique: true }
);

export const HabitLog = model("HabitLog", habitLogSchema);