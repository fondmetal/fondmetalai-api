import { getOpenAiClient } from "./openai-service.js";
import { config } from "../config.js";

function fallbackResponse(plan, language = "it") {
  const isEnglish = language === "en";

  switch (plan.type) {
    case "ask_missing":
      return isEnglish
        ? `To answer accurately I still need: ${plan.fields.join(", ")}.`
        : `Per risponderti con precisione mi servono ancora: ${plan.fields.join(", ")}.`;
    case "disambiguation":
      return isEnglish
        ? `I found multiple ${plan.subject}. Choose one:\n- ${plan.options.join("\n- ")}`
        : `Ho trovato piu' ${plan.subject}. Scegline una:\n- ${plan.options.join("\n- ")}`;
    case "not_found":
      return isEnglish ? plan.messageEn || plan.message : plan.message;
    case "wheel_info":
      return isEnglish
        ? `Official specs for ${plan.wheel.model}:\n- Diameters: ${plan.diameters.join(", ")}\n- Finishes: ${plan.finishes.join(", ")}`
        : `Scheda tecnica ufficiale ${plan.wheel.model}:\n- Diametri: ${plan.diameters.join(", ")}\n- Finiture: ${plan.finishes.join(", ")}`;
    case "cars_for_wheel":
      return isEnglish
        ? `Compatible vehicle families for ${plan.wheel.model} ${plan.wheel.diameter}":\n- ${plan.cars.join("\n- ")}`
        : `Famiglie auto compatibili per ${plan.wheel.model} ${plan.wheel.diameter}":\n- ${plan.cars.join("\n- ")}`;
    case "fitment_exact":
      if (!plan.compatible) {
        return isEnglish
          ? `${plan.wheel.model} ${plan.wheel.diameter}" is NOT compatible with ${plan.car.label} according to the official Fondmetal data.`
          : `${plan.wheel.model} ${plan.wheel.diameter}" NON risulta compatibile con ${plan.car.label} secondo i dati ufficiali Fondmetal.`;
      }
      return isEnglish
        ? `${plan.wheel.model} ${plan.wheel.diameter}" is compatible with ${plan.car.label}.\n- ${plan.configurations
            .map((item) => `${item.diameter}" ${item.width} ET${item.et}${item.pcd ? ` | PCD ${item.pcd}` : ""}`)
            .join("\n- ")}`
        : `${plan.wheel.model} ${plan.wheel.diameter}" risulta compatibile con ${plan.car.label}.\n- ${plan.configurations
            .map((item) => `${item.diameter}" ${item.width} ET${item.et}${item.pcd ? ` | PCD ${item.pcd}` : ""}`)
            .join("\n- ")}`;
    case "recommendations":
      return isEnglish
        ? `Recommended wheels for ${plan.car.label}:\n- ${plan.items.join("\n- ")}`
        : `Cerchi consigliati per ${plan.car.label}:\n- ${plan.items.join("\n- ")}`;
    case "homologations_by_car":
      return isEnglish
        ? `Official homologation data for ${plan.car.label}:\n- ${plan.items.join("\n- ")}`
        : `Dati ufficiali di omologazione per ${plan.car.label}:\n- ${plan.items.join("\n- ")}`;
    case "general_info":
      return plan.text;
    default:
      return isEnglish ? "I do not have enough data to answer." : "Non ho dati sufficienti per rispondere.";
  }
}

const systemPrompt = `
Sei FondmetalAI. Riceverai un JSON con:
- originalMessage
- language
- responsePlan

Regole obbligatorie:
- Rispondi solo usando i dati nel responsePlan.
- Non inventare misure, omologazioni, disponibilita' o compatibilita'.
- Se responsePlan chiede chiarimenti o disambiguazione, fai solo quello.
- Mantieni tono professionale, sintetico, commerciale ma preciso.
- Usa la lingua indicata in "language". Se manca, usa la lingua dell'originalMessage.
`;

export async function renderResponse({ originalMessage, language, responsePlan }) {
  const client = getOpenAiClient();
  if (!client) {
    return fallbackResponse(responsePlan, language);
  }

  try {
    const completion = await client.chat.completions.create({
      model: config.openai.mainModel,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            originalMessage,
            language,
            responsePlan,
          }),
        },
      ],
    });

    return (
      completion.choices[0]?.message?.content?.trim() ||
      fallbackResponse(responsePlan, language)
    );
  } catch (_error) {
    return fallbackResponse(responsePlan, language);
  }
}
