//We implement your duplicate-game UX using a nameKey (normalized name).
import { Schema, model, type InferSchemaType } from "mongoose";

export const GameCategory = ["BRADSPEL", "KORTSPEL", "ANNAT"] as const;

const gameSchema = new Schema(
  {
    name: { type: String, required: true },
    nameKey: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, enum: GameCategory }
  },
  { timestamps: true }
);

export type GameDoc = InferSchemaType<typeof gameSchema>;
export const GameModel = model("Game", gameSchema);
