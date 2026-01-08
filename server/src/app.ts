import express from "express";
import cors from "cors";
import { logger } from "./config/logger";
import { meRouter } from "./routes/me.routes";

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

  return app;
}
