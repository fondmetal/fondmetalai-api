import { getOpenAiClient } from "./openai-service.js";
import { config } from "../config.js";
import { parseDiameter, parseYear } from "../utils/strings.js";

const systemPrompt = `
Estrai dalla richiesta utente un JSON puro con questi campi:
- intent: uno tra "fitment_by_car", "recommendation_by_car", "omologation_by_car", "fitment_by_wheel", "wheel_info", "general_info", "other"
- language: codice lingua ISO semplificato come "it", "en", "de", "fr", "es"
- brand
- model
- year
- version
- wheel
- diameter

Regole:
- Non inventare dati mancanti: usa null.
- Se l'utente chiede su quali auto si monta un cerchio: "fitment_by_wheel".
- Se chiede info su un cerchio specifico senza auto: "wheel_info".
- Se chiede consigli/compatibilita'/omologazioni per la sua auto: usa l'intent corretto by_car.
- Rispondi solo con JSON puro.
`;

function fallbackIntent(message, context = {}) {
  const lower = String(message || "").toLowerCase();
  let intent = "other";

  if (/omolog|ece|kba|tuv|tuev|jwl|nad/.test(lower)) {
    intent = "omologation_by_car";
  } else if (/consigli|recommend|which wheels|what wheels|quali cerchi/.test(lower)) {
    intent = "recommendation_by_car";
  } else if (/su quali auto|which cars|fit .* wheel|monta.*auto/.test(lower)) {
    intent = "fitment_by_wheel";
  } else if (/info|spec|diametr|finitur|et|pcd|offset|canale|width/.test(lower)) {
    intent = context.wheel ? "wheel_info" : "general_info";
  } else if (/compatib|monta|fitment|va bene|posso montare/.test(lower)) {
    intent = "fitment_by_car";
  }

  return {
    intent,
    language: /[a-z]/i.test(message) ? "it" : "it",
    brand: null,
    model: null,
    year: parseYear(message),
    version: null,
    wheel: null,
    diameter: parseDiameter(message),
  };
}

export async function analyzeMessage(message, context = {}) {
  const client = getOpenAiClient();
  if (!client) {
    return fallbackIntent(message, context);
  }

  try {
    const completion = await client.chat.completions.create({
      model: config.openai.analysisModel,
      temperature: 0,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            message,
            context,
          }),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    const match = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : raw);

    return {
      intent: parsed.intent || "other",
      language: parsed.language || "it",
      brand: parsed.brand || null,
      model: parsed.model || null,
      year: parseYear(parsed.year),
      version: parsed.version || null,
      wheel: parsed.wheel || null,
      diameter: parseDiameter(parsed.diameter),
    };
  } catch (_error) {
    return fallbackIntent(message, context);
  }
}
