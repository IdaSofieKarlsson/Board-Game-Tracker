import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { GameModel } from "../models/Game";
import { createGameSchema } from "../schemas/games.schemas";
import { normalizeGameName } from "../utils/normalize";
import { logger } from "../config/logger";

export const gamesRouter = Router();

gamesRouter.get("/", requireAuth, async (_req, res) => {
  const games = await GameModel.find().sort({ name: 1 }).exec();
  return res.json(games);
});

gamesRouter.post("/", requireAuth, async (req, res) => {
  const parsed = createGameSchema.safeParse(req.body);
  logger.info("Posted a new game.");

  if (!parsed.success) {
    logger.error("invalid data when posting a new game.");
    return res.status(400).json({ message: "Invalid payload" });
  }

  const { name, category } = parsed.data;
  const nameKey = normalizeGameName(name);

  const existing = await GameModel.findOne({ nameKey }).exec();
  if (existing) {
    return res.status(409).json({
      code: "GAME_ALREADY_EXISTS",
      game: {
        id: existing._id,
        name: existing.name,
        category: existing.category
      }
    });
  }

  const created = await GameModel.create({
    name,
    nameKey,
    category
  });

  return res.status(201).json(created);
});
