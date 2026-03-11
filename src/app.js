import express from "express";
import { config } from "./config.js";
import { requestContext } from "./middleware/request-context.js";
import { basicSecurityHeaders } from "./middleware/security.js";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import { SessionStore } from "./services/session-store.js";
import { MemoryRateLimiter } from "./services/rate-limiter.js";
import { createPublicRouter } from "./routes/public.js";
import { createAdminRouter } from "./routes/admin.js";

const sessions = new SessionStore({
  ttlMs: config.sessionTtlMs,
  maxEntries: config.sessionMaxEntries,
  historyMaxItems: config.historyMaxItems,
});

const rateLimiter = new MemoryRateLimiter({
  windowMs: config.rateLimitWindowMs,
  maxRequests: config.rateLimitMax,
});

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);

  app.use(requestContext);
  app.use(basicSecurityHeaders);
  app.use(corsMiddleware);
  app.use(express.json({ limit: "20kb" }));

  app.use(createPublicRouter({ sessions, rateLimiter }));
  app.use(createAdminRouter());

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
