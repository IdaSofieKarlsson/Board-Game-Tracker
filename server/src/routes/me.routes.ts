import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { ensureUser } from "../services/user.service";
import { UserModel } from "../models/User";

export const meRouter = Router();

meRouter.get("/", requireAuth, async (req, res) => {
  const authUser = req.authUser!;
  const user = await ensureUser(authUser.firebaseUid, authUser.email);

  return res.json({
    email: user.email,
    username: user.username ?? null,
    funFact: user.funFact ?? null
  });
});
