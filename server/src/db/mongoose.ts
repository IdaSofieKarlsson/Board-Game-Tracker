import mongoose from "mongoose";

let connecting: Promise<typeof mongoose> | null = null;

export async function connectMongo(uri: string) {
  if (!uri) throw new Error("MONGODB_URI is missing");
  // Avoid re-connecting in dev/hot reload scenarios
  if (mongoose.connection.readyState === 1) return; // connected

  if (!connecting) {
    connecting = mongoose.connect(uri);
  }

  await connecting;
}
