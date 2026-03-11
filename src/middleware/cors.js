import { config } from "../config.js";

function matchesOrigin(origin) {
  return config.allowedOrigins.includes(origin);
}

export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  if (origin && matchesOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Admin-Token, X-Request-Id, X-Session-Id"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,OPTIONS"
    );
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(origin && matchesOrigin(origin) ? 204 : 403);
  }

  next();
}
