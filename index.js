import { createApp } from "./src/app.js";
import { config } from "./src/config.js";
import { logger } from "./src/logger.js";

const app = createApp();

app.listen(config.port, () => {
  logger.info("server_started", {
    port: config.port,
    nodeEnv: config.nodeEnv,
    allowedOrigins: config.allowedOrigins,
  });
});
