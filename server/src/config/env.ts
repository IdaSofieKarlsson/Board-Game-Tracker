import "dotenv/config";

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3001,
  MONGODB_URI: process.env.MONGODB_URI ?? "",
  NODE_ENV: process.env.NODE_ENV ?? "development"
};
