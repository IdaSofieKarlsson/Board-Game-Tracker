import type { Request, Response, NextFunction } from "express";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  req.authUser = {
    firebaseUid: "test-firebase-uid",
    email: "test@example.com"
  };
  return next();
}
//This is the key trick: Jest will use this mock automatically when we jest.mock("../middleware/auth").