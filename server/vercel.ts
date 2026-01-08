import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "./src/app";
import { env } from "./src/config/env";
import { connectMongo } from "./src/db/mongoose";
import { logger } from "./src/config/logger";

const app = createApp();

// Make sure we connect to MongoDB only once per warm function instance
let mongoReady: Promise<void> | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!mongoReady) {
      mongoReady = connectMongo(env.MONGODB_URI).then(() => undefined);
      logger.info("mongo_connected");
    }

    await mongoReady;
    return app(req as any, res as any);
  } catch (err) {
    logger.error("vercel_handler_failed", { err });
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
