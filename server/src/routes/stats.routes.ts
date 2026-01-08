import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/auth";
import { ensureUser } from "../services/user.service";
import { SessionModel } from "../models/Session";

export const statsRouter = Router();

statsRouter.get("/overview", requireAuth, async (req, res) => {
  const authUser = req.authUser!;
  const user = await ensureUser(authUser.firebaseUid, authUser.email);

  const userId = new mongoose.Types.ObjectId((user as any)._id);

  const agg = await SessionModel.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$gameId",
        sessions: { $sum: 1 },
        points: { $sum: "$points" }
      }
    },
    { $sort: { sessions: -1 } }
  ]);

  const totalPoints = agg.reduce((sum, x) => sum + (x.points ?? 0), 0);

  const favoriteGameId = agg.length > 0 ? agg[0]._id : null;

  return res.json({
    totalPoints,
    favoriteGameId
  });
});
