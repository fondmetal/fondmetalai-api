import { config } from "../config.js";
import { UnauthorizedError } from "../utils/errors.js";

export function requireAdmin(req, _res, next) {
  if (!config.adminToken) {
    return next(
      new UnauthorizedError(
        "ADMIN_TOKEN non configurato. Endpoint admin disabilitati."
      )
    );
  }

  const token = req.header("x-admin-token");
  if (!token || token !== config.adminToken) {
    return next(new UnauthorizedError("Token admin non valido."));
  }

  next();
}
