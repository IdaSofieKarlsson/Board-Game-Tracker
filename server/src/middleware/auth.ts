import type { Request, Response, NextFunction } from "express";
import { getFirebaseAdmin } from "../auth/firebaseAdmin";

export type AuthUser = {
  firebaseUid: string;
  email: string | null;
};

//Short answer - Ignore it. Completely.
/*Why this is safe
This is a TypeScript lint/style warning, not a runtime error
The code is correct and standard for extending Express Request
It does not affect runtime behavior
It will not break CI, tests, or the server*/

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("Authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ message: "Missing Authorization Bearer token" });
  }

  const token = match[1];

  try {
    const admin = getFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(token);

    req.authUser = {
      firebaseUid: decoded.uid,
      email: decoded.email ?? null
    };

    return next();
  } catch (err) {
    console.error("verifyIdToken failed", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }

}
