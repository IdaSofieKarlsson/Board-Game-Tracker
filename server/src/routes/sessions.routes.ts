import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/auth";
import { ensureUser } from "../services/user.service";
import { createSessionSchema } from "../schemas/sessions.schemas";
import { SessionModel } from "../models/Session";
import { GameModel } from "../models/Game";
import { pointsFromResult } from "../services/points.service";
import { logger } from "../config/logger";

export const sessionsRouter = Router();

sessionsRouter.post("/", requireAuth, async (req, res) => {
  const authUser = req.authUser!;
  const parsed = createSessionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const user = await ensureUser(authUser.firebaseUid, authUser.email);

  const { gameId, result, playedAt } = parsed.data;

  if (!mongoose.isValidObjectId(gameId)) {
    return res.status(400).json({ message: "Invalid gameId" });
  }

  const gameExists = await GameModel.exists({ _id: gameId });
  if (!gameExists) {
    return res.status(404).json({ message: "Game not found" });
  }

  const points = pointsFromResult(result);
  const playedAtDate = playedAt ? new Date(playedAt) : new Date();

  if (Number.isNaN(playedAtDate.getTime())) {
    return res.status(400).json({ message: "Invalid playedAt" });
  }

  if (playedAtDate.getTime() > Date.now()) {
    return res.status(400).json({ message: "playedAt cannot be in the future" });
  }

  const created = await SessionModel.create({
    userId: (user as any)._id,
    gameId,
    result,
    points,
    playedAt: playedAtDate
  });
  logger.info("A session was registered.");
  return res.status(201).json(created);
});
