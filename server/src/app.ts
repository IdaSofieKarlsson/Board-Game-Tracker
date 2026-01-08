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

  const allowedOrigins = [
      "http://localhost:5173",
      process.env.CLIENT_ORIGIN // set this in Vercel for server
    ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: false
    })
  );
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
