import express from "express";
import net from "net";
import {
  databaseVersion,
  describeTables,
  getFitmentByIds,
  listApplicationsSample,
  listTables,
  pingDatabase,
} from "../repositories/catalog-repository.js";
import { requireAdmin } from "../middleware/admin-auth.js";
import { ValidationError } from "../utils/errors.js";

export function createAdminRouter() {
  const router = express.Router();

  router.get("/health-db", requireAdmin, async (_req, res, next) => {
    try {
      res.json({
        ok: await pingDatabase(),
        version: await databaseVersion(),
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/tcp-check", requireAdmin, async (_req, res) => {
    const host = process.env.DB_HOST;
    const dbPort = 3306;
    const timestamp = new Date().toISOString();
    const socket = new net.Socket();

    socket.setTimeout(5000);

    socket.once("connect", () => {
      socket.destroy();
      res.json({
        ok: true,
        note: "TCP connect OK",
        host,
        port: dbPort,
        timestamp,
      });
    });

    socket.once("timeout", () => {
      socket.destroy();
      res.status(504).json({
        ok: false,
        error: "ETIMEDOUT",
        host,
        port: dbPort,
        timestamp,
      });
    });

    socket.once("error", (error) => {
      res.status(500).json({
        ok: false,
        error: String(error.message || error),
        host,
        port: dbPort,
        timestamp,
      });
    });

    socket.connect(dbPort, host);
  });

  router.get("/db-tables", requireAdmin, async (_req, res, next) => {
    try {
      res.json({ ok: true, tables: await listTables() });
    } catch (error) {
      next(error);
    }
  });

  router.get("/db-applications-sample", requireAdmin, async (_req, res, next) => {
    try {
      const rows = await listApplicationsSample();
      res.json({ ok: true, count: rows.length, rows });
    } catch (error) {
      next(error);
    }
  });

  router.get("/fitment-debug", requireAdmin, async (req, res, next) => {
    try {
      const carId = Number.parseInt(req.query?.car, 10);
      const wheelId = Number.parseInt(req.query?.wheel, 10);

      if (!carId || !wheelId) {
        throw new ValidationError(
          "Parametri mancanti. Usa /fitment-debug?car=ID_CAR&wheel=ID_WHEEL"
        );
      }

      const row = await getFitmentByIds(carId, wheelId);
      if (!row) {
        return res.json({
          ok: false,
          error: "Nessuna combinazione trovata per questi ID",
          carId,
          wheelId,
        });
      }

      return res.json({
        ok: true,
        carId,
        wheelId,
        raw: row,
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/debug-tables", requireAdmin, async (_req, res, next) => {
    try {
      res.json(
        await describeTables([
          "car_manufacturers",
          "car_models",
          "car_versions",
          "am_wheel_models",
          "am_wheels",
          "applications",
        ])
      );
    } catch (error) {
      next(error);
    }
  });

  return router;
}
