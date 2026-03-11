import express from "express";
import {
  getFitmentByIds,
  listBrands,
  listModelsForBrand,
  listWheelsForBrandModelYear,
  listYearsForBrandModel,
} from "../repositories/catalog-repository.js";
import { buildChatReply } from "../services/chat-service.js";
import { extractHomologations } from "../services/fitment.js";
import { ValidationError } from "../utils/errors.js";

export function createPublicRouter({ sessions, rateLimiter }) {
  const router = express.Router();

  router.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  router.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  router.get("/api/status", async (_req, res) => {
    res.json({
      ok: true,
      service: "fondmetalai-api",
      version: "2.0.0",
    });
  });

  router.post("/chat", async (req, res, next) => {
    try {
      rateLimiter.consume(req.ip);

      const message = req.body?.message;
      if (typeof message !== "string" || !message.trim()) {
        throw new ValidationError("Messaggio vuoto.");
      }

      const incomingSessionId =
        req.body?.sessionId || req.header("x-session-id") || null;
      const { sessionId, session } = sessions.ensure(incomingSessionId);

      const result = await buildChatReply({
        message: message.trim(),
        session,
      });

      sessions.updateContext(sessionId, result.context);
      sessions.appendHistory(sessionId, {
        user: message.trim(),
        assistant: result.reply,
        at: new Date().toISOString(),
      });

      res.json({
        reply: result.reply,
        sessionId,
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/fitment", async (req, res, next) => {
    try {
      const carId = Number.parseInt(req.body?.carId, 10);
      const wheelId = Number.parseInt(req.body?.wheelId, 10);

      if (!carId || !wheelId) {
        throw new ValidationError(
          "Parametri mancanti. Devi inviare carId e wheelId."
        );
      }

      const row = await getFitmentByIds(carId, wheelId);
      if (!row) {
        return res.json({
          ok: false,
          error: "Nessuna combinazione trovata",
          carId,
          wheelId,
        });
      }

      res.json({
        ok: true,
        carId,
        wheelId,
        fitment: {
          type: row.fitment_type,
          advice: row.fitment_advice,
          limitation: row.limitation,
          limitation_IT: row.limitation_IT,
          plugAndPlay: Boolean(row.plug_play),
        },
        homologations: extractHomologations(row),
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/api/marche", async (_req, res, next) => {
    try {
      res.json(await listBrands());
    } catch (error) {
      next(error);
    }
  });

  router.get("/api/modelli", async (req, res, next) => {
    try {
      const brand = req.query?.marca;
      if (typeof brand !== "string" || !brand.trim()) {
        throw new ValidationError("Parametro 'marca' mancante.");
      }

      res.json(await listModelsForBrand(brand.trim()));
    } catch (error) {
      next(error);
    }
  });

  router.get("/api/anni", async (req, res, next) => {
    try {
      const brand = req.query?.marca;
      const model = req.query?.modello;

      if (typeof brand !== "string" || !brand.trim()) {
        throw new ValidationError("Parametro 'marca' mancante.");
      }
      if (typeof model !== "string" || !model.trim()) {
        throw new ValidationError("Parametro 'modello' mancante.");
      }

      res.json(await listYearsForBrandModel(brand.trim(), model.trim()));
    } catch (error) {
      next(error);
    }
  });

  router.get("/api/cerchi", async (req, res, next) => {
    try {
      const brand = req.query?.marca;
      const model = req.query?.modello;
      const year = Number.parseInt(req.query?.anno, 10);

      if (typeof brand !== "string" || !brand.trim()) {
        throw new ValidationError("Parametro 'marca' mancante.");
      }
      if (typeof model !== "string" || !model.trim()) {
        throw new ValidationError("Parametro 'modello' mancante.");
      }
      if (!year) {
        throw new ValidationError("Parametro 'anno' mancante o non valido.");
      }

      res.json(
        await listWheelsForBrandModelYear(brand.trim(), model.trim(), year)
      );
    } catch (error) {
      next(error);
    }
  });

  return router;
}
