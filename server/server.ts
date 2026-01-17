import { createApp } from "./src/app";
import { env } from "./src/config/env";
import { connectMongo } from "./src/db/mongoose";
import { logger } from "./src/config/logger";

async function main() {
  await connectMongo(env.MONGODB_URI);

  const app = createApp();

  // Vercel provides PORT at runtime; fall back for local dev
//  const port = Number(process.env.PORT) || env.PORT || 3001;

  const port = Number(process.env.PORT) || 3001;
  
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

main().catch((err) => {
  logger.error("server_failed_to_start", { err });
  process.exit(1);
});
