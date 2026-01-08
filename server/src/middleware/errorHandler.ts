import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  logger.error("unhandled_error", { err });
  return res.status(500).json({ message: "Internal Server Error" });
}
