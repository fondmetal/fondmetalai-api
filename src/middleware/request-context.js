import crypto from "crypto";
import { logger } from "../logger.js";

export function requestContext(req, res, next) {
  const requestId = req.header("x-request-id") || crypto.randomUUID();
  const start = Date.now();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  res.on("finish", () => {
    logger.info("request_completed", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
    });
  });

  next();
}
