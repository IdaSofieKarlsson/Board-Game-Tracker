import mongoose from "mongoose";

export async function connectMongo(uri: string) {
  if (!uri) throw new Error("MONGODB_URI is missing");

  // Avoid re-connecting in dev/hot reload scenarios
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(uri);
}
