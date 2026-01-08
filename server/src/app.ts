import express from "express";
import cors from "cors";
import { logger } from "./config/logger";
import { meRouter } from "./routes/me.routes";
import { gamesRouter } from "./routes/games.routes";
import { sessionsRouter } from "./routes/sessions.routes";
import { statsRouter } from "./routes/stats.routes";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Simple request logging
  app.use((req, _res, next) => {
    logger.info("request", { method: req.method, path: req.path });
    next();
  });

  app.use("/api/me", meRouter);
  app.use("/api/games", gamesRouter);
  app.use("/api/sessions", sessionsRouter);
  app.use("/api/stats", statsRouter);

  // ... after all routes
  app.use(errorHandler);

  return app;
}
