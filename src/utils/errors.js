export class AppError extends Error {
  constructor(statusCode, code, message, details = null, expose = statusCode < 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.expose = expose;
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(400, "VALIDATION_ERROR", message, details, true);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Non autorizzato.") {
    super(401, "UNAUTHORIZED", message, null, true);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Troppe richieste. Riprova tra poco.") {
    super(429, "RATE_LIMITED", message, null, true);
  }
}
