import { AppError } from "../utils/errors.js";
import { logger } from "../logger.js";

export function notFound(_req, res) {
  res.status(404).json({
    error: "Endpoint non trovato.",
    code: "NOT_FOUND",
  });
}

export function errorHandler(err, req, res, _next) {
  const error = err instanceof AppError ? err : null;
  const statusCode = error?.statusCode || 500;

  logger.error("request_failed", {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: err,
  });

  res.status(statusCode).json({
    error: error?.expose ? error.message : "Errore interno.",
    code: error?.code || "INTERNAL_ERROR",
    requestId: req.requestId,
    details: error?.expose ? error.details : null,
  });
}
