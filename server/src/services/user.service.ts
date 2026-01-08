//User bootstrap (ensure user exists)
import { UserModel } from "../models/User";

export async function ensureUser(firebaseUid: string, email: string | null) {
  const existing = await UserModel.findOne({ firebaseUid }).exec();
  if (existing) return existing;

  // Email might be null depending on provider/settings; store empty string if needed
  const created = await UserModel.create({
    firebaseUid,
    email: email ?? ""
  });

  return created;
}
