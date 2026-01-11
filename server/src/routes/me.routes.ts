import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { ensureUser } from "../services/user.service";
import { updateMeSchema } from "../schemas/me.schemas";

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

meRouter.patch("/", requireAuth, async (req, res) => {
  const authUser = req.authUser!;
  const parsed = updateMeSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const user = await ensureUser(authUser.firebaseUid, authUser.email);

  if (parsed.data.username !== undefined) {
    user.username = parsed.data.username;
  }
  if (parsed.data.funFact !== undefined) {
    user.funFact = parsed.data.funFact;
  }

  await user.save();

  return res.json({
    email: user.email,
    username: user.username ?? null,
    funFact: user.funFact ?? null
  });
});
