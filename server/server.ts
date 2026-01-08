import { createApp } from "./src/app";
import { env } from "./src/config/env";
import { connectMongo } from "./src/db/mongoose";
import { logger } from "./src/config/logger";

async function main() {
  await connectMongo(env.MONGODB_URI);

  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info("server_started", { port: env.PORT });
  });
}

main().catch((err) => {
  logger.error("server_failed_to_start", { err });
  process.exit(1);
});
