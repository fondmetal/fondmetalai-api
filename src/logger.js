import { config } from "./config.js";

const PRIORITY = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function serializeError(error) {
  if (!(error instanceof Error)) {
    return error;
  }

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
}

function normalizeMeta(meta) {
  if (!meta || typeof meta !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(meta).map(([key, value]) => [
      key,
      value instanceof Error ? serializeError(value) : value,
    ])
  );
}

function shouldLog(level) {
  return PRIORITY[level] >= PRIORITY[config.logLevel] || level === "error";
}

function write(level, event, meta = {}) {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    time: new Date().toISOString(),
    level,
    event,
    ...normalizeMeta(meta),
  };

  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  console.log(line);
}

export const logger = {
  debug(event, meta) {
    write("debug", event, meta);
  },
  info(event, meta) {
    write("info", event, meta);
  },
  warn(event, meta) {
    write("warn", event, meta);
  },
  error(event, meta) {
    write("error", event, meta);
  },
};
