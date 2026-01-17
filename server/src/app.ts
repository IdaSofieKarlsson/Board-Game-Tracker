import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { logger } from "./config/logger";
import { meRouter } from "./routes/me.routes";
import { gamesRouter } from "./routes/games.routes";
import { sessionsRouter } from "./routes/sessions.routes";
import { statsRouter } from "./routes/stats.routes";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  const allowedOrigins = new Set(
    [
      "http://localhost:5173",
      process.env.CLIENT_ORIGIN
    ].filter(Boolean)
  );

  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true); // Insomnia / server-to-server
        if (allowedOrigins.has(origin)) return cb(null, true);
        return cb(new Error(`CORS blocked for origin: ${origin}`));
      },
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );

  app.options(/.*/, cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.has(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  app.use(express.json());

  //app.get("/health", (_req, res) => res.json({ ok: true }));
  app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    mongoReadyState: mongoose.connection.readyState, // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  });
});

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
