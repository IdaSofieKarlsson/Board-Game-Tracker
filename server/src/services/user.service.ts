//User bootstrap (ensure user exists)
import { UserModel } from "../models/User";

export async function ensureUser(firebaseUid: string, email: string | null) {
  // Atomic upsert prevents duplicate key race conditions
  const user = await UserModel.findOneAndUpdate(
    { firebaseUid },
    {
      $setOnInsert: {
        firebaseUid,
        email: email ?? ""
      }
    },
    { new: true, upsert: true }
  ).exec();

  return user;
}
