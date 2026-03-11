import {
  getExactFitment,
  getWheelInfo,
  listCarsForWheel,
  listHomologationOptionsForCar,
  listWheelOptionsForCar,
  searchManufacturers,
  searchModels,
  searchWheelModels,
} from "../repositories/catalog-repository.js";
import { formatFitmentRows, extractHomologations } from "./fitment.js";
import { analyzeMessage } from "./intent-service.js";
import { renderResponse } from "./response-renderer.js";
import {
  cleanString,
  parseDiameter,
  parseYear,
  titleCase,
  wheelNamesEqual,
} from "../utils/strings.js";

function mergeContext(previous, analysis) {
  const next = {
    language: analysis.language || previous.language || "it",
    brand: previous.brand || null,
    manufacturerId: previous.manufacturerId || null,
    model: previous.model || null,
    modelId: previous.modelId || null,
    year: previous.year || null,
    version: previous.version || null,
    wheel: previous.wheel || null,
    wheelModelId: previous.wheelModelId || null,
    diameter: previous.diameter || null,
  };

  if (analysis.brand && cleanString(analysis.brand) !== cleanString(previous.brand)) {
    next.brand = analysis.brand;
    next.manufacturerId = null;
    next.model = analysis.model || null;
    next.modelId = null;
    next.year = analysis.year || null;
    next.version = analysis.version || null;
  } else {
    if (analysis.brand) next.brand = analysis.brand;
    if (analysis.model && cleanString(analysis.model) !== cleanString(previous.model)) {
      next.model = analysis.model;
      next.modelId = null;
      next.year = analysis.year || null;
      next.version = analysis.version || null;
    }
    if (analysis.model && !previous.model) next.model = analysis.model;
    if (analysis.year) next.year = analysis.year;
    if (analysis.version) next.version = analysis.version;
  }

  if (analysis.wheel && !wheelNamesEqual(analysis.wheel, previous.wheel)) {
    next.wheel = analysis.wheel;
    next.wheelModelId = null;
    next.diameter = analysis.diameter || null;
  } else {
    if (analysis.wheel) next.wheel = analysis.wheel;
    if (analysis.diameter) next.diameter = analysis.diameter;
  }

  return next;
}

function chooseMatch(results, key) {
  if (!results.length) {
    return { status: "not_found" };
  }
  if (results.length === 1 || results[0].match_rank === 0) {
    return { status: "resolved", value: results[0] };
  }
  return {
    status: "ambiguous",
    options: results.map((row) => row[key]).slice(0, 5),
  };
}

function buildCarLabel(context) {
  return [context.brand, context.model, context.year].filter(Boolean).join(" ");
}

function buildAskMissingPlan(fields) {
  return {
    type: "ask_missing",
    fields,
  };
}

function buildGeneralInfoPlan(message) {
  const lower = String(message).toLowerCase();
  let text =
    "Per essere preciso su dati tecnici e compatibilita' devo partire dai dati ufficiali dell'auto o del cerchio. Se vuoi, scrivimi marca, modello, anno oppure il nome del cerchio Fondmetal.";

  if (/pcd|foratura|interasse/.test(lower)) {
    text =
      "Il PCD indica numero fori e interasse del fissaggio. Per confermare la compatibilita' del cerchio con la tua auto servono sempre i dati ufficiali della specifica applicazione.";
  } else if (/et|offset/.test(lower)) {
    text =
      "L'ET e' l'offset del cerchio. Influisce su posizione della ruota e ingombri. Per confermare se una misura va bene servono i dati ufficiali Fondmetal per quella vettura.";
  } else if (/canale|larghezza|width/.test(lower)) {
    text =
      "Il canale e' la larghezza del cerchio. Va sempre valutato insieme a diametro, ET e PCD per verificare una compatibilita' reale.";
  } else if (/omolog/.test(lower)) {
    text =
      "Le omologazioni vanno confermate solo sui dati ufficiali della combinazione auto + cerchio. Se mi scrivi marca, modello e anno posso verificare cosa risulta.";
  }

  return {
    type: "general_info",
    text,
  };
}

export async function handleChatMessage({ message, session }) {
  const analysis = await analyzeMessage(message, session.context);
  const context = mergeContext(session.context || {}, analysis);

  if (!context.brand && !context.wheel && analysis.intent !== "general_info") {
    return {
      context,
      responsePlan: buildAskMissingPlan(["marca e modello auto oppure nome del cerchio"]),
      language: context.language,
    };
  }

  if (context.brand && !context.manufacturerId) {
    const manufacturerResults = await searchManufacturers(context.brand);
    const manufacturerMatch = chooseMatch(manufacturerResults, "manufacturer");
    if (manufacturerMatch.status === "not_found") {
      return {
        context,
        responsePlan: {
          type: "not_found",
          message: `Non trovo una marca compatibile con "${context.brand}".`,
          messageEn: `I could not find a brand matching "${context.brand}".`,
        },
        language: context.language,
      };
    }
    if (manufacturerMatch.status === "ambiguous") {
      return {
        context,
        responsePlan: {
          type: "disambiguation",
          subject: "marche compatibili",
          options: manufacturerMatch.options,
        },
        language: context.language,
      };
    }
    context.manufacturerId = manufacturerMatch.value.id;
    context.brand = manufacturerMatch.value.manufacturer;
  }

  const carIntent = [
    "fitment_by_car",
    "recommendation_by_car",
    "omologation_by_car",
  ].includes(analysis.intent);

  if (carIntent && !context.model) {
    return {
      context,
      responsePlan: buildAskMissingPlan(["modello auto"]),
      language: context.language,
    };
  }

  if (context.brand && context.model && !context.modelId) {
    const modelResults = await searchModels(context.manufacturerId, context.model);
    const modelMatch = chooseMatch(modelResults, "model");
    if (modelMatch.status === "not_found") {
      return {
        context,
        responsePlan: {
          type: "not_found",
          message: `Non trovo un modello compatibile con "${context.model}" per ${context.brand}.`,
          messageEn: `I could not find a model matching "${context.model}" for ${context.brand}.`,
        },
        language: context.language,
      };
    }
    if (modelMatch.status === "ambiguous") {
      return {
        context,
        responsePlan: {
          type: "disambiguation",
          subject: "modelli compatibili",
          options: modelMatch.options,
        },
        language: context.language,
      };
    }
    context.modelId = modelMatch.value.id;
    context.model = modelMatch.value.model;
  }

  if (context.wheel && !context.wheelModelId) {
    const wheelResults = await searchWheelModels(context.wheel);
    const wheelMatch = chooseMatch(wheelResults, "model");
    if (wheelMatch.status === "not_found") {
      return {
        context,
        responsePlan: {
          type: "not_found",
          message: `Non trovo un cerchio Fondmetal compatibile con "${context.wheel}".`,
          messageEn: `I could not find a Fondmetal wheel matching "${context.wheel}".`,
        },
        language: context.language,
      };
    }
    if (wheelMatch.status === "ambiguous") {
      return {
        context,
        responsePlan: {
          type: "disambiguation",
          subject: "modelli di cerchio",
          options: wheelMatch.options,
        },
        language: context.language,
      };
    }
    context.wheelModelId = wheelMatch.value.id;
    context.wheel = wheelMatch.value.model;
  }

  if (analysis.intent === "general_info") {
    return {
      context,
      responsePlan: buildGeneralInfoPlan(message),
      language: context.language,
    };
  }

  if (carIntent && !context.year) {
    return {
      context,
      responsePlan: buildAskMissingPlan(["anno auto"]),
      language: context.language,
    };
  }

  if (analysis.intent === "wheel_info") {
    if (!context.wheelModelId) {
      return {
        context,
        responsePlan: buildAskMissingPlan(["nome del cerchio Fondmetal"]),
        language: context.language,
      };
    }
    const wheelInfo = await getWheelInfo(context.wheelModelId);
    if (!wheelInfo) {
      return {
        context,
        responsePlan: {
          type: "not_found",
          message: `Per ${context.wheel} non risultano dati tecnici ufficiali disponibili.`,
        },
        language: context.language,
      };
    }
    return {
      context,
      responsePlan: {
        type: "wheel_info",
        wheel: { model: wheelInfo.model },
        diameters: String(wheelInfo.diameters || "")
          .split(",")
          .filter(Boolean),
        finishes: String(wheelInfo.finishes || "")
          .split(", ")
          .filter(Boolean),
      },
      language: context.language,
    };
  }

  if (analysis.intent === "fitment_by_wheel" && !context.diameter) {
    return {
      context,
      responsePlan: buildAskMissingPlan(["diametro del cerchio"]),
      language: context.language,
    };
  }

  if (analysis.intent === "fitment_by_wheel" && context.wheelModelId && context.diameter && !context.modelId) {
    const cars = await listCarsForWheel({
      wheelModelId: context.wheelModelId,
      diameter: context.diameter,
    });

    return {
      context,
      responsePlan: {
        type: "cars_for_wheel",
        wheel: { model: context.wheel, diameter: context.diameter },
        cars: cars.slice(0, 40).map((row) => {
          const years = row.year_start || row.year_stop
            ? ` (${row.year_start || "?"} - ${row.year_stop || "?"})`
            : "";
          return `${row.manufacturer} ${row.model}${years}`;
        }),
      },
      language: context.language,
    };
  }

  if (context.modelId && context.year && context.wheelModelId && context.diameter) {
    const fitmentRows = await getExactFitment({
      manufacturerId: context.manufacturerId,
      modelId: context.modelId,
      year: context.year,
      wheelModelId: context.wheelModelId,
      diameter: context.diameter,
    });

    return {
      context,
      responsePlan: {
        type: "fitment_exact",
        compatible: fitmentRows.length > 0,
        car: { label: buildCarLabel(context) },
        wheel: { model: context.wheel, diameter: context.diameter },
        configurations: formatFitmentRows(fitmentRows),
      },
      language: context.language,
    };
  }

  if (analysis.intent === "recommendation_by_car" || analysis.intent === "fitment_by_car") {
    const rows = await listWheelOptionsForCar({
      manufacturerId: context.manufacturerId,
      modelId: context.modelId,
      year: context.year,
    });

    if (!rows.length) {
      return {
        context,
        responsePlan: {
          type: "not_found",
          message: `Per ${buildCarLabel(context)} non risultano cerchi Fondmetal attivi nel database.`,
        },
        language: context.language,
      };
    }

    const grouped = new Map();
    for (const row of rows) {
      const current = grouped.get(row.wheel_model_id) || {
        model: row.wheel_model,
        diameters: [],
        finishes: new Set(),
      };
      current.diameters.push(row.diameter);
      for (const finish of String(row.finishes || "").split(", ").filter(Boolean)) {
        current.finishes.add(finish);
      }
      grouped.set(row.wheel_model_id, current);
    }

    const items = [...grouped.values()]
      .slice(0, 5)
      .map((item) => {
        const diameters = [...new Set(item.diameters)].sort((a, b) => b - a);
        const finishes = [...item.finishes];
        return `${item.model} | diametri: ${diameters.join(", ")}" | finiture: ${
          finishes.length ? finishes.join(" | ") : "non disponibili"
        }`;
      });

    return {
      context,
      responsePlan: {
        type: "recommendations",
        car: { label: buildCarLabel(context) },
        items,
      },
      language: context.language,
    };
  }

  if (analysis.intent === "omologation_by_car") {
    const rows = await listHomologationOptionsForCar({
      manufacturerId: context.manufacturerId,
      modelId: context.modelId,
      year: context.year,
    });

    if (!rows.length) {
      return {
        context,
        responsePlan: {
          type: "not_found",
          message: `Per ${buildCarLabel(context)} non risultano omologazioni attive nei dati ufficiali disponibili.`,
        },
        language: context.language,
      };
    }

    const items = rows.slice(0, 40).map((row) => {
      const homologations = extractHomologations(row)
        .map((item) => (item.code ? `${item.type}: ${item.code}` : item.type))
        .join(" | ");
      return `${row.wheel_model} ${row.diameter}" ${row.width} ET${row.et}${
        row.pcd_label ? ` | PCD ${row.pcd_label}` : ""
      } | omologazioni: ${homologations || "nessuna"}${
        row.plug_play ? " | Plug & Play" : ""
      }${row.limitation_IT ? ` | limitazioni: ${row.limitation_IT}` : ""}`;
    });

    return {
      context,
      responsePlan: {
        type: "homologations_by_car",
        car: { label: buildCarLabel(context) },
        items,
      },
      language: context.language,
    };
  }

  return {
    context,
    responsePlan: buildGeneralInfoPlan(message),
    language: context.language,
  };
}

export async function buildChatReply({ message, session }) {
  const result = await handleChatMessage({ message, session });
  const reply = await renderResponse({
    originalMessage: message,
    language: result.language,
    responsePlan: result.responsePlan,
  });

  return {
    reply,
    context: result.context,
    responsePlan: result.responsePlan,
  };
}
