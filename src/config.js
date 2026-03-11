import dotenv from "dotenv";

dotenv.config();

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(value, fallback = false) {
  if (value == null || value === "") {
    return fallback;
  }
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function splitCsv(value, fallback = []) {
  if (!value) {
    return fallback;
  }
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toInt(process.env.PORT, 3000),
  trustProxy: toBool(process.env.TRUST_PROXY, true),
  allowedOrigins: splitCsv(process.env.ALLOWED_ORIGINS, [
    "https://fondmetal.com",
    "https://www.fondmetal.com",
  ]),
  adminToken: process.env.ADMIN_TOKEN || "",
  fondmetalLineId: toInt(process.env.FONDMETAL_LINE_ID, 22),
  sessionTtlMs: toInt(process.env.SESSION_TTL_MS, 15 * 60 * 1000),
  sessionMaxEntries: toInt(process.env.SESSION_MAX_ENTRIES, 1000),
  historyMaxItems: toInt(process.env.HISTORY_MAX_ITEMS, 12),
  rateLimitWindowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 60 * 1000),
  rateLimitMax: toInt(process.env.RATE_LIMIT_MAX, 60),
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    analysisModel: process.env.OPENAI_ANALYSIS_MODEL || "gpt-4o-mini",
    mainModel: process.env.OPENAI_MAIN_MODEL || "gpt-4o",
    timeoutMs: toInt(process.env.OPENAI_TIMEOUT_MS, 12000),
  },
  db: {
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
    name: process.env.DB_NAME || "",
    connectTimeoutMs: toInt(process.env.DB_CONNECT_TIMEOUT_MS, 10000),
    connectionLimit: toInt(process.env.DB_CONNECTION_LIMIT, 10),
  },
  logLevel: process.env.LOG_LEVEL || "info",
};

export function getMissingDbConfig() {
  const required = [
    ["DB_HOST", config.db.host],
    ["DB_USER", config.db.user],
    ["DB_PASS", config.db.password],
    ["DB_NAME", config.db.name],
  ];

  return required.filter(([, value]) => !value).map(([key]) => key);
}

export function isOpenAiEnabled() {
  return Boolean(config.openai.apiKey);
}
