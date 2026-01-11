//"Types" removed from import below, as declared but never read
import { Schema, model, type InferSchemaType } from "mongoose";

export const SessionResult = ["WIN", "TIE", "LOSS"] as const;

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    gameId: { type: Schema.Types.ObjectId, ref: "Game", required: true, index: true },
    result: { type: String, required: true, enum: SessionResult },
    points: { type: Number, required: true },
    playedAt: { type: Date, required: true }
  },
  { timestamps: true }
);

export type SessionDoc = InferSchemaType<typeof sessionSchema>;
export const SessionModel = model("Session", sessionSchema);
