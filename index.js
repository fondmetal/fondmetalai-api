import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import pool from "./db.js";
import net from "net";
import https from "https";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// =========================
// OPENAI CLIENT
// =========================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Modello principale del bot (GPT personalizzato FondmetalAI)
const OPENAI_MAIN_MODEL =
  process.env.OPENAI_MAIN_MODEL || "g-67e2a78742b48191bd3173b3abbded97";

// Modello per analisi intent (più leggero)
const OPENAI_ANALYSIS_MODEL =
  process.env.OPENAI_ANALYSIS_MODEL || "gpt-5-mini";

const fondmetalPrompt = `
Sei FondmetalAI, il chatbot ufficiale di Fondmetal per il nostro sito, specializzato in cerchi in lega per auto.

RUOLO GENERALE
- Fornisci supporto tecnico e commerciale di primo livello sui cerchi Fondmetal.
- Parla sempre come un consulente interno Fondmetal: professionale, cordiale, diretto.
- Rispondi con frasi brevi e chiare, tono amichevole e umano, non burocratico.
- Non scrivere mai "fondmetal.com": chiamalo sempre "il nostro sito" o "sul nostro sito".
- Le tue risposte devono basarsi solo sulle informazioni disponibili:
  - nei contenuti del nostro sito,
  - nei dati tecnici strutturati che ti vengono passati nel contesto (ad es. tramite messaggi di sistema o elenchi di dati).
- Quando NON hai dati sufficienti, lo dici chiaramente e non inventi mai misure, omologazioni o abbinamenti cerchio/auto.

STILE DI COMUNICAZIONE
- Sei più commerciale che tecnico: il tuo obiettivo è aiutare l'utente a capire quali cerchi possono andare bene e invogliarlo a scegliere un prodotto Fondmetal.
- Usa un linguaggio semplice e concreto, evitando gergo troppo tecnico se non è necessario.
- Quando spieghi concetti tecnici (ET, canale, centraggio, ecc.), fallo in modo breve e con esempi pratici.
- Metti sempre in evidenza i vantaggi per l'utente: estetica (look più sportivo/elegante), praticità (plug & play, nessuna modifica particolare), tranquillità (omologazioni disponibili, compatibilità).
- Ogni volta che proponi un cerchio, aggiungi una breve nota di stile o utilizzo (es. più sportivo, più elegante, ideale per uso quotidiano, ecc.).

USO DEI DATI TECNICI
- Se nei messaggi di sistema trovi dati tecnici strutturati (ad esempio fitment, omologazioni, plug & play, limitazioni, ecc.):
  - Considerali come la fonte principale e affidabile.
  - Non modificarli, non interpretarli "a fantasia".
  - Se non trovi una certa informazione nei dati ricevuti, considera che NON ce l'hai.
- Se non hai dati tecnici strutturati per la combinazione richiesta:
  - NON limitarti a dire di usare il configuratore.
  - Dai comunque una spiegazione generale dell'argomento (es. differenza tra 17" e 18", cosa significa omologazione).
  - Spiega quali informazioni ti mancano (es. anno, versione, misura dei pneumatici).
  - Solo alla fine suggerisci il configuratore 3D sul nostro sito o il contatto con un rivenditore/assistenza come passo successivo.
- Quando ricevi le finiture dai dati tecnici, devono essere elencate esattamente così come sono scritte nel database. Non trasformarle mai in codici ID o abbreviazioni.

COMUNICAZIONE COMMERCIALE
- Sei caloroso, positivo e coinvolgente: fai complimenti per la vettura ("Ottima scelta, la BMW X5 è perfetta per i cerchi dal design sportivo").
- Quando consigli un cerchio, aggiungi sempre una motivazione estetica o funzionale.
- Se l’utente fornisce marca, modello e anno, devi SEMPRE proporre almeno 3–5 modelli reali compatibili presi dal database.
- Non rimandare l’utente al sito: è già sul sito.
- Puoi nominare il configuratore 3D solo se serve per vedere l’anteprima.
- Le finiture devono essere indicate **con il loro nome ufficiale**.
- Le larghezze dei canali devono essere espresse senza la “J” finale.

COMPORTAMENTO PER I CASI D'USO PRINCIPALI

1) L'utente vuole sapere quali cerchi montano sulla sua auto.
   - Prima di rispondere, fai domande mirate per raccogliere i dati minimi:
     - Marca
     - Modello
     - Anno (e se necessario generazione/serie)
   - Se hai dati tecnici strutturati per quell'auto:
     - Spiega quali cerchi risultano compatibili e in che configurazione (es. diametri, canali, ET, eventuali limitazioni).
   - Se NON hai dati strutturati sufficienti:
     - Dai comunque qualche indicazione generale (es. quali diametri sono più frequenti su quel tipo di vettura, differenze estetiche tra misure).
     - Spiega quali informazioni mancano per essere precisi.
     - Solo alla fine invita l'utente a usare il configuratore 3D sul nostro sito, spiegando brevemente cosa gli permetterà di vedere.

2) L'utente vuole sapere quali cerchi gli consigli per la sua auto.
   - Prima raccogli gli stessi dati del punto 1 (marca, modello, anno, uso dell'auto).
   - Se hai dati tecnici strutturati, usa quelli per proporre cerchi effettivamente compatibili.
   - Consiglia i modelli più recenti prima.
   - Quando fai una proposta, spiega in modo sintetico:
     - perché quel modello di cerchio è adatto (stile, uso, dimensioni),
     - in che diametri/finiture è disponibile (solo se queste informazioni sono presenti nei dati o chiaramente sul sito).
   - Non consigliare mai cerchi non presenti nel catalogo Fondmetal.

3) L'utente vuole sapere quali cerchi sono omologati per la sua auto.
   - Raccogli sempre prima i dati di identificazione della vettura (marca, modello, anno).
   - Se nei dati tecnici strutturati ci sono informazioni di omologazione (ECE, TUV, KBA, JWL, ITA):
     - Elenca chiaramente i tipi di omologazione disponibili per i cerchi associati a questa famiglia di vetture.
     - Spiega in modo semplice che, se una colonna di omologazione nel database è vuota, significa che per quella combinazione non è disponibile quell'omologazione.
   - Se NON hai dati strutturati sulla omologazione per quella combinazione:
     - Spiega che non puoi confermare l'omologazione senza consultare i dati ufficiali.
     - Fornisci qualche indicazione generale (es. differenza tra omologazione ECE e TUV).
     - Suggerisci di:
       - verificare tramite il configuratore 3D sul nostro sito, oppure
       - contattare direttamente il rivenditore o l'assistenza Fondmetal.
   - Non confermare mai un'omologazione che non risulta dai dati ricevuti.

4) L'utente parte da un cerchio e chiede su quali auto può montarlo.
   - Chiedi all'utente di che cerchio si tratta (nome modello e, se possibile, diametro e finitura).
   - Se nei dati tecnici strutturati ricevi elenchi di applicazioni/fitment:
     - Spiega per quali tipologie di vetture è dichiarata la compatibilità (marca, modello, eventuale generazione/segmento).
     - Non è necessario elencare centinaia di versioni: riassumi per macro-modelli e mercati, mantenendo chiarezza.
   - Se NON hai dati strutturati:
     - Spiega che per sapere tutte le auto compatibili è necessario usare il configuratore 3D sul nostro sito o contattare un rivenditore.

5) L'utente chiede informazioni generali sui cerchi.
   - Può chiedere di:
     - finiture disponibili,
     - diametri,
     - canali,
     - ET (offset),
     - forature, centraggio, caratteristiche costruttive,
     - differenze tra linee o modelli.
   - In questi casi rispondi in modo didattico ma conciso, spiegando i concetti in modo chiaro.
   - Se la domanda è generica (es. "cos'è l'ET?"), fornisci una spiegazione tecnica semplice e neutra, collegandola se possibile ai cerchi Fondmetal.
   - Se la domanda riguarda uno specifico modello di cerchio e hai dati strutturati, utilizza quei dati per dare una risposta precisa.

GESTIONE DEL DIALOGO
- Quando mancano informazioni importanti per dare una risposta precisa, NON andare subito al configuratore:
  - fai 1 o 2 domande mirate per completare il quadro;
  - solo dopo, se ancora non è possibile essere specifici, suggerisci il configuratore o il contatto diretto.
- Non fare mai domande inutili: concentrati su quelli che servono davvero (marca, modello, anno, uso, cerchio, dimensioni).
- Ogni volta che cambi argomento (es. da compatibilità a consigli estetici), chiarisci cosa stai facendo.
- NON devi mai dire “visita il nostro sito” o “guarda sul nostro sito”: l’utente è già sul sito. Se serve, puoi dire “nel configuratore puoi visualizzare l’anteprima”.NON devi mai dire “visita il nostro sito” o “guarda sul nostro sito”: l’utente è già sul sito. Se serve, puoi dire “nel configuratore puoi visualizzare l’anteprima”.

LIMITI E ONESTÀ
- Non inventare mai dati tecnici (misure, omologazioni, codici, pesi, carichi, ecc.).
- Se non sei sicuro di un'informazione o non compare nei dati forniti:
  - dillo chiaramente,
  - dai eventualmente indicazioni generali,
  - e suggerisci all'utente il passo successivo più utile (configuratore 3D, rivenditore, assistenza).
- Non promettere mai disponibilità, tempi di consegna o prezzi: in questi casi indirizza sempre al rivenditore o all'assistenza.

LINGUA
- Puoi rispondere in qualunque lingua, adattandoti a quella usata dall'utente.
- Mantieni sempre un tono coerente: tecnico ma comprensibile, cortese, sicuro quando hai i dati, prudente quando non li hai.
`;

const chatHistory = new Map(); // userID → array di messaggi

// =========================
// ANALISI RICHIESTA (INTENT + PARAMETRI)
// =========================
async function analyzeUserRequest(message) {
  try {
    const completion = await openai.responses.create({
      model: OPENAI_ANALYSIS_MODEL, // es. "gpt-5-mini"

      input: [
        {
          role: "system",
          content: `
Analizza la richiesta dell'utente e restituisci un JSON con:
- intent
- marca, modello, anno, versione, cerchio, diametro

Intent validi:
"fitment_by_car", "recommendation_by_car", "omologation_by_car",
"fitment_by_wheel", "wheel_info", "general_info", "other".

Rispondi SOLO con JSON puro, senza testo extra.
Esempio:

{
  "intent": "...",
  "brand": "...",
  "model": "...",
  "year": 2019,
  "version": "...",
  "wheel": "...",
  "diameter": "...",
  "extra": null
}
          `
        },
        {
          role: "user",
          content: message
        }
      ],

      // Modelli GPT-5-mini supportano: minimal, low, medium, high
      reasoning: { effort: "minimal" },
      text: { verbosity: "low" }
    });

    const raw = completion.output_text?.trim() || "";
    console.log("Raw analyzeUserRequest:", raw);

    // Rimuove eventuali ```json ... ```
    let jsonText = raw;
    const fencedMatch = raw.match(/```(?:json)?([\s\S]*?)```/i);
    if (fencedMatch?.[1]) jsonText = fencedMatch[1].trim();

    // Estrai oggetto {...}
    const braceMatch = jsonText.match(/\{[\s\S]*\}/);
    if (braceMatch) jsonText = braceMatch[0];

    const parsed = JSON.parse(jsonText);

    // Normalizzazione anno
    let year = parsed.year ?? null;
    if (typeof year === "string") {
      const m = year.match(/(19|20)\d{2}/);
      year = m ? parseInt(m[0]) : null;
    }
    if (typeof year === "number" && (year < 1950 || year > 2100)) {
      year = null;
    }

    return {
      intent: parsed.intent ?? "other",
      brand: parsed.brand ?? null,
      model: parsed.model ?? null,
      year,
      version: parsed.version ?? null,
      wheel: parsed.wheel ?? null,
      diameter: parsed.diameter ?? null,
      extra: parsed.extra ?? null
    };

  } catch (err) {
    console.error("Errore analyzeUserRequest:", err);
    return null;
  }
}

// =========================
// FUNZIONI DB DI SUPPORTO
// =========================

// 1) Trova ID del costruttore (marca auto)
async function findManufacturerId(name) {
  const [rows] = await pool.query(
    "SELECT id FROM car_manufacturers WHERE manufacturer LIKE ? LIMIT 1",
    [`%${name}%`]
  );
  return rows.length ? rows[0].id : null;
}

// 2) Trova ID del modello (car_models)
async function findModelId(manufacturerId, modelName) {
  const [rows] = await pool.query(
    "SELECT id FROM car_models WHERE manufacturer = ? AND model LIKE ? LIMIT 1",
    [manufacturerId, `%${modelName}%`]
  );
  return rows.length ? rows[0].id : null;
}

// 3) Trova ID della versione auto (car_versions) in base alla label versione
async function findCarVersionIdByLabel(modelId, versionName) {
  const [rows] = await pool.query(
    "SELECT id FROM car_versions WHERE car = ? AND version LIKE ? LIMIT 1",
    [modelId, `%${versionName}%`]
  );
  return rows.length ? rows[0].id : null;
}

// 4) Trova ID del modello cerchio (am_wheel_models)
async function findWheelModelId(modelName) {
  const [rows] = await pool.query(
    "SELECT id FROM am_wheel_models WHERE model LIKE ? LIMIT 1",
    [`%${modelName}%`]
  );
  return rows.length ? rows[0].id : null;
}

// 5) Trova versione cerchio (diametro) e relativo am_wheel
async function findWheelVersionId(wheelModelId, diameter) {
  const dia =
    typeof diameter === "string"
      ? parseInt((diameter.match(/(\d{2})/) || [])[1], 10)
      : Number(diameter);

  if (!dia || Number.isNaN(dia)) return null;

  const [rows] = await pool.query(
    `SELECT v.id, v.am_wheel
     FROM am_wheel_versions v
     JOIN am_wheels w ON v.am_wheel = w.id
     WHERE w.model = ? AND w.diameter = ?
     LIMIT 1`,
    [wheelModelId, dia]
  );
  return rows.length ? rows[0] : null; // { id: versione_id, am_wheel: wheelId }
}

// 6) Recupera la combinazione in applications
async function getFitmentData(carVersionId, wheelAmId) {
  const [rows] = await pool.query(
    "SELECT * FROM applications WHERE car = ? AND am_wheel = ? LIMIT 1",
    [carVersionId, wheelAmId]
  );
  if (rows.length) {
    if (rows[0].channel) {
      rows[0].channel = String(rows[0].channel).replace(/J$/i, "");
    }
  }
  return rows.length ? rows[0] : null;
}

// 7) Info di base su un modello di cerchio: diametri + finiture
async function getWheelBasicInfo(wheelName) {
  const [rows] = await pool.query(
    `SELECT 
       m.id AS model_id,
       m.model AS model_name,
       GROUP_CONCAT(DISTINCT w.diameter ORDER BY w.diameter) AS diameters,
       GROUP_CONCAT(DISTINCT v.finish ORDER BY v.finish) AS finishes
     FROM am_wheel_models m
     JOIN am_wheels w ON w.model = m.id
     JOIN am_wheel_versions v ON v.am_wheel = w.id
     WHERE m.model LIKE ?
     GROUP BY m.id
     LIMIT 1`,
    [`%${wheelName}%`]
  );
  return rows.length ? rows[0] : null;
}

// 8) Tutti i modelli ruota che risultano applicati ad un modello di auto
async function getWheelModelsForCarModel(modelId) {
  const [rows] = await pool.query(
    `SELECT 
       m.id   AS model_id,
       m.model AS model_name,
       MAX(w.diameter) AS max_diameter,
       MAX(w.updated_at) AS last_update
     FROM car_versions cv
     JOIN applications a ON a.car = cv.id
     JOIN am_wheels w    ON a.am_wheel = w.id
     JOIN am_wheel_models m ON w.model = m.id
     WHERE cv.car = ?
       AND w.status = 'ACTIVE'
     GROUP BY m.id, m.model
     ORDER BY last_update DESC, max_diameter DESC
     LIMIT 12`,
    [modelId]
  );
  return rows;
}

// 9) Tutte le vetture su cui monta un certo cerchio (fitment_by_wheel)
async function getCarsForWheel(wheelName, diameter) {
  const dia =
    typeof diameter === "string"
      ? parseInt((diameter.match(/(\d{2})/) || [])[1], 10)
      : Number(diameter);

  if (!dia || Number.isNaN(dia)) return [];

  const [rows] = await pool.query(
    `SELECT 
       man.manufacturer AS manufacturer_name,
       cm.model         AS model_name
     FROM am_wheel_models wm
     JOIN am_wheels w        ON w.model = wm.id
     JOIN applications a     ON a.am_wheel = w.id
     JOIN car_versions cv    ON cv.id = a.car
     JOIN car_models cm      ON cm.id = cv.car
     JOIN car_manufacturers man ON man.id = cm.manufacturer
     WHERE wm.model LIKE ?
       AND w.diameter = ?
     GROUP BY man.manufacturer, cm.model
     ORDER BY man.manufacturer, cm.model
     LIMIT 100`,
    [`%${wheelName}%`, dia]
  );

  return rows;
}

// 10) Omologazioni per una famiglia di vetture (per intent omologation_by_car)
async function getHomologationsByCarModel(modelId) {
  const [rows] = await pool.query(
    `SELECT 
       m.model    AS wheel_model,
       w.diameter AS diameter,
       MAX(a.homologation_tuv) AS homologation_tuv,
       MAX(a.homologation_kba) AS homologation_kba,
       MAX(a.homologation_ece) AS homologation_ece,
       MAX(a.homologation_jwl) AS homologation_jwl,
       MAX(a.homologation_ita) AS homologation_ita
     FROM car_versions cv
     JOIN applications a   ON a.car = cv.id
     JOIN am_wheels w      ON a.am_wheel = w.id
     JOIN am_wheel_models m ON w.model = m.id
     WHERE cv.car = ?
       AND w.status = 'ACTIVE'
     GROUP BY m.model, w.diameter
     ORDER BY m.model, w.diameter`,
    [modelId]
  );
  return rows;
}

// ===================================================
// CHATBOT /chat
// ===================================================
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const userId = req.body.userId || "default";

    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ error: "Messaggio vuoto." });
    }

    // Recupero cronologia PRIMA dell'analisi, così posso usarla per i follow-up (es. "2022")
    const history = chatHistory.get(userId) || [];

    // Costruisco un messaggio di analisi che tiene conto dei follow-up brevi
    let messageForAnalysis = userMessage;
    const trimmed = userMessage.trim();

    // Se il messaggio è tipo "2022", "si", "no" (poche cifre, niente lettere),
    // lo attacco all'ultima domanda utente precedente.
    if (trimmed.length < 6 && !/[a-zA-Z]/.test(trimmed)) {
      const lastUser = [...history].reverse().find((m) => m.role === "user");
      if (lastUser) {
        messageForAnalysis =
          lastUser.content +
          "\n\nRisposta aggiuntiva dell'utente (follow-up): " +
          userMessage;
      }
    }

    // Analisi richiesta (intent + parametri)
    let analysis = await analyzeUserRequest(messageForAnalysis);
    if (!analysis) {
      analysis = { intent: "other" };
    }
    console.log("Analysis:", analysis);

    let fitmentRow = null;
    let homologations = [];
    let fitmentSummary = null;
    let wheelInfoSummary = null;
    let carWheelOptions = null;
    let wheelFitmentCars = null;
    let carHomologations = null;
    let needMoreCarData = false;
    let needMoreWheelData = false;

    // === Caso: info su modello di ruota (wheel_info) ===
    if (analysis.intent === "wheel_info" && analysis.wheel) {
      try {
        wheelInfoSummary = await getWheelBasicInfo(analysis.wheel);
        console.log("Wheel info:", wheelInfoSummary);
      } catch (e) {
        console.warn("Errore getWheelBasicInfo:", e.message || e);
      }
    }

    // === Caso: su quali auto posso montare questo cerchio (fitment_by_wheel) ===
    if (analysis.intent === "fitment_by_wheel") {
      if (!analysis.wheel || !analysis.diameter) {
        needMoreWheelData = true;
      } else {
        try {
          wheelFitmentCars = await getCarsForWheel(
            analysis.wheel,
            analysis.diameter
          );
          console.log("Cars for wheel:", wheelFitmentCars?.length || 0);
        } catch (e) {
          console.warn("Errore getCarsForWheel:", e.message || e);
        }
      }
    }

    // === Intent che si basano sull'auto ===
    const isCarFitmentIntent =
      analysis.intent === "fitment_by_car" ||
      analysis.intent === "recommendation_by_car" ||
      analysis.intent === "omologation_by_car";

    let manufacturerId = null;
    let modelId = null;

    if (isCarFitmentIntent) {
      // Se manca qualcosa dell'auto → segnalalo al modello (per fare domande, non per bloccare il DB)
      if (!analysis.brand || !analysis.model || (!analysis.year && !analysis.version)) {
        needMoreCarData = true;
      }

      // Se abbiamo almeno marca + modello, calcoliamo i modelli di cerchio dal DB
      if (analysis.brand && analysis.model) {
        try {
          manufacturerId = await findManufacturerId(analysis.brand);
          if (manufacturerId) {
            modelId = await findModelId(manufacturerId, analysis.model);
          }
          if (modelId) {
            // Cerchi associati alla famiglia di vetture
            carWheelOptions = await getWheelModelsForCarModel(modelId);

            // Se sta chiedendo omologazioni, recuperiamo anche le omologazioni per famiglia
            if (analysis.intent === "omologation_by_car") {
              carHomologations = await getHomologationsByCarModel(modelId);
              console.log(
                "Homologations by car model:",
                carHomologations?.length || 0
              );
            }
          }
        } catch (err) {
          console.warn(
            "Errore getWheelModelsForCarModel/getHomologationsByCarModel:",
            err.message || err
          );
        }
      }

      // Se in più abbiamo anche versione + cerchio + diametro → fitment preciso
      if (
        analysis.brand &&
        analysis.model &&
        analysis.version &&
        analysis.wheel &&
        analysis.diameter &&
        modelId
      ) {
        try {
          const carVersionId = await findCarVersionIdByLabel(
            modelId,
            analysis.version
          );
          if (!carVersionId) throw new Error("Versione auto non trovata");

          const wheelModelId = await findWheelModelId(analysis.wheel);
          if (!wheelModelId) throw new Error("Modello cerchio non trovato");

          const wheelVersion = await findWheelVersionId(
            wheelModelId,
            analysis.diameter
          );
          if (!wheelVersion) throw new Error("Versione cerchio non trovata");

          fitmentRow = await getFitmentData(
            carVersionId,
            wheelVersion.am_wheel
          );

          if (fitmentRow) {
            if (fitmentRow.homologation_tuv)
              homologations.push({
                type: "TUV",
                code: fitmentRow.homologation_tuv
              });
            if (fitmentRow.homologation_kba)
              homologations.push({
                type: "KBA",
                code: fitmentRow.homologation_kba
              });
            if (fitmentRow.homologation_ece)
              homologations.push({
                type: "ECE",
                code: fitmentRow.homologation_ece
              });
            if (fitmentRow.homologation_jwl)
              homologations.push({
                type: "JWL",
                code: fitmentRow.homologation_jwl
              });
            if (fitmentRow.homologation_ita)
              homologations.push({
                type: "ITA",
                code: fitmentRow.homologation_ita
              });

            fitmentSummary = {
              carVersionId,
              wheelAmId: wheelVersion.am_wheel,
              fitment_type: fitmentRow.fitment_type,
              fitment_advice: fitmentRow.fitment_advice,
              limitation: fitmentRow.limitation,
              limitation_IT: fitmentRow.limitation_IT,
              plug_play: !!fitmentRow.plug_play,
              homologations
            };
          }
        } catch (e) {
          console.warn("Errore fitment DB:", e.message || e);
        }
      }
    }

    const messages = [{ role: "system", content: fondmetalPrompt }];

    // Dati tecnici ruota (wheel_info)
    if (wheelInfoSummary) {
      messages.push({
        role: "system",
        content:
          "Dati tecnici dal database su un modello di cerchio richiesto dall'utente:\n" +
          `- Modello: ${wheelInfoSummary.model_name}\n` +
          `- Diametri disponibili: ${
            wheelInfoSummary.diameters || "non indicati"
          }\n` +
          `- Finiture disponibili: ${
            wheelInfoSummary.finishes || "non indicate"
          }\n\n` +
          "Quando l'utente chiede informazioni su questo modello di cerchio, usa questi dati per rispondere " +
          "e non inventare nuove finiture o diametri."
      });
    }

    // Dati tecnici: lista modelli ruota per l'auto (anche senza cerchio specifico)
    if (carWheelOptions && carWheelOptions.length) {
      const list = carWheelOptions
        .map(
          (r) =>
            `- ${r.model_name} (diametro massimo a catalogo: ${
              r.max_diameter || "n/d"
            })`
        )
        .join("\n");

      messages.push({
        role: "system",
        content:
          "Dal database interno risultano i seguenti modelli di cerchi Fondmetal associati a questa famiglia di vetture:\n" +
          list +
          "\n\nQuando l'utente ti chiede che cerchi consigli/gli montano sulla sua auto, " +
          "puoi usare questi modelli come base per i tuoi suggerimenti. " +
          "Spiega sempre che si tratta di modelli compatibili secondo i nostri dati tecnici, " +
          "ma che per la conferma finale di misure e omologazioni è comunque necessario verificare il singolo allestimento."
      });
    }
    
    // NUOVO: risposta commerciale pronta quando abbiamo almeno marca + modello (+ anno opzionale)
    if (
      isCarFitmentIntent &&
      !needMoreCarData &&
      carWheelOptions &&
      carWheelOptions.length &&
      !fitmentSummary // cioè non stiamo cercando versione + diametro
    ) {
      const list = carWheelOptions
        .slice(0, 6)
        .map((r) => `- ${r.model_name} (${r.max_diameter}")`)
        .join("\n");

      messages.push({
        role: "system",
        content:
          "Per questa auto hai già a disposizione una lista di cerchi compatibili dal database Fondmetal.\n" +
          "Elenca almeno 3 modelli tra questi, con un tono commerciale e cordiale, spiegando brevemente lo stile di ciascun cerchio."
      });
    }

    // Dati tecnici omologazioni per famiglia di vetture (omologation_by_car, anche senza cerchio specifico)
    if (carHomologations && carHomologations.length) {
      const lines = carHomologations.map((r) => {
        const types = [];
        if (r.homologation_ece) types.push("ECE");
        if (r.homologation_tuv) types.push("TUV");
        if (r.homologation_kba) types.push("KBA");
        if (r.homologation_jwl) types.push("JWL");
        if (r.homologation_ita) types.push("ITA");
        const typesText = types.length
          ? types.join(", ")
          : "nessuna omologazione disponibile per questa combinazione.";
        return `- Cerchio ${r.wheel_model} ${r.diameter}" → ${typesText}`;
      });

      const content =
        "Dati di omologazione dal database interno per questa famiglia di vetture:\n" +
        lines.join("\n") +
        "\n\nInterpreta così questi dati:\n" +
        "- Se per un certo cerchio/diametro una colonna di omologazione è vuota, significa che per quella combinazione NON è disponibile quell'omologazione.\n" +
        "- Se la colonna contiene un valore, significa che per quella combinazione è presente quell'omologazione.\n\n" +
        "Quando l'utente chiede quali cerchi sono omologati per la sua auto, usa queste informazioni per spiegare:\n" +
        "- quali modelli di cerchio Fondmetal risultano omologati (e con quali tipi di omologazione),\n" +
        "- e quali invece non hanno omologazione registrata, senza inventare nulla.";

      messages.push({
        role: "system",
        content
      });
    }

    // Dati tecnici fitment (auto + cerchio specifico)
    if (fitmentSummary && analysis) {
      const omologazioniText = homologations.length
        ? homologations
            .map((h) => `${h.type}${h.code ? ` (${h.code})` : ""}`)
            .join(", ")
        : "nessuna omologazione presente nel database per questa combinazione.";

      messages.push({
        role: "system",
        content:
          "Dati tecnici verificati dal database interno per la richiesta attuale:\n" +
          `- Marca: ${analysis.brand}\n` +
          `- Modello: ${analysis.model}\n` +
          `- Anno: ${analysis.year || "non specificato"}\n` +
          `- Versione: ${analysis.version || "non specificata"}\n` +
          `- Cerchio: ${analysis.wheel}\n` +
          `- Diametro: ${analysis.diameter}\n` +
          `- Fitment type: ${fitmentSummary.fitment_type || "n/d"}\n` +
          `- Plug & Play: ${fitmentSummary.plug_play ? "sì" : "no"}\n` +
          `- Limitazioni: ${
            fitmentSummary.limitation_IT ||
            fitmentSummary.limitation ||
            "nessuna specificata"
          }\n` +
          `- Omologazioni: ${omologazioniText}\n\n` +
          "Quando rispondi su questa combinazione specifica auto-cerchio devi basarti su questi dati e non inventare nulla. " +
          "Se l'utente parla di un'altra auto o di un altro cerchio per cui non hai dati dal database, spiegalo chiaramente e chiedi maggiori dettagli."
      });
    }

    // Dati tecnici: elenco vetture per un certo cerchio (fitment_by_wheel)
    if (wheelFitmentCars && wheelFitmentCars.length && analysis.wheel) {
      const list = wheelFitmentCars
        .map((r) => `- ${r.manufacturer_name} ${r.model_name}`)
        .join("\n");

      messages.push({
        role: "system",
        content:
          "Dal database interno risultano le seguenti famiglie di vetture su cui è applicato questo cerchio nel diametro indicato:\n" +
          list +
          "\n\nQuando l'utente ti chiede su quali auto può montare questo cerchio, " +
          "usa questo elenco per spiegare i principali modelli compatibili. " +
          "Non è necessario elencare ogni singola versione: puoi raggruppare per marca e modello, " +
          "ricordando sempre che per la conferma finale servono i dettagli della singola vettura."
      });
    }

    // Se mancano dati sull'auto e l'intent è legato al fitment dell'auto → fai domande mirate
    if (isCarFitmentIntent && needMoreCarData) {
      messages.push({
        role: "system",
        content:
          "L'utente ti sta chiedendo informazioni sui cerchi per una specifica auto (compatibilità, consigli o omologazioni), " +
          "ma non ti ha ancora dato tutti i dati necessari. " +
          "Prima di dare qualunque risposta dettagliata, fai UNA o due domande chiare per completare i dati dell'auto: " +
          "chiedi marca, modello e soprattutto anno di immatricolazione (o generazione/serie). " +
          "Spiega in modo semplice che misure e omologazioni cambiano tra le generazioni, " +
          "quindi hai bisogno di quei dati per essere più preciso. " +
          "Evita di rimandare subito al configuratore: guida tu la conversazione e intanto dai qualche indicazione generale utile."
      });
    }

    // Se mancano dati sul cerchio per fitment_by_wheel → chiedi modello + diametro
    if (analysis.intent === "fitment_by_wheel" && needMoreWheelData) {
      messages.push({
        role: "system",
        content:
          "L'utente ti sta chiedendo su quali auto può montare un certo cerchio, " +
          "ma non ti ha ancora indicato chiaramente modello del cerchio e diametro. " +
          "Prima di dare qualsiasi informazione tecnica, chiedi all'utente almeno: " +
          "nome del modello di cerchio Fondmetal e diametro (es. 18, 19, 20). " +
          "Spiega che compatibilità e omologazioni cambiano molto in base al diametro."
      });
    }

    // Aggiungo cronologia e messaggio utente
    messages.push(...history, { role: "user", content: userMessage });

    const completion = await openai.responses.create({
      model: OPENAI_MAIN_MODEL,
      input: messages,
      reasoning: { effort: "none" },
      text: { verbosity: "medium" }
    });

    const reply = completion.output_text;

    // Aggiorna cronologia (massimo 10 scambi)
    const updatedHistory = [
      ...history,
      { role: "user", content: userMessage },
      { role: "assistant", content: reply }
    ].slice(-10);
    chatHistory.set(userId, updatedHistory);

    res.json({
      reply,
      fitmentUsed: !!fitmentSummary,
      wheelInfoUsed: !!wheelInfoSummary,
      carWheelOptionsUsed: !!(carWheelOptions && carWheelOptions.length),
      wheelFitmentUsed: !!(wheelFitmentCars && wheelFitmentCars.length),
      carHomologationsUsed: !!(carHomologations && carHomologations.length)
    });
  } catch (error) {
    console.error("ERRORE /chat:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Errore nella generazione della risposta." });
  }
});

// Avvio server
app.listen(port, () => {
  console.log(`FondmetalAI API in ascolto su http://localhost:${port}`);
});

// =========================
// HEALTHCHECK & DEBUG
// =========================

app.get("/health-db", async (_req, res) => {
  try {
    const [one] = await pool.query("SELECT 1 AS ok");
    const [ver] = await pool.query("SELECT VERSION() AS version");
    res.json({ ok: !!one?.[0]?.ok, version: ver?.[0]?.version || null });
  } catch (err) {
    console.error("[DB] Health error:", err);
    res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

app.get("/tcp-check", async (req, res) => {
  const host = process.env.DB_HOST;
  const dbPort = 3306;
  const startTime = new Date().toISOString();

  const getPublicIP = () =>
    new Promise((resolve) => {
      https
        .get("https://api.ipify.org?format=json", (resp) => {
          let data = "";
          resp.on("data", (chunk) => (data += chunk));
          resp.on("end", () => {
            try {
              const json = JSON.parse(data);
              resolve(json.ip);
            } catch (e) {
              resolve("Non disponibile");
            }
          });
        })
        .on("error", (err) => {
          resolve("Errore nel recupero IP: " + err.message);
        });
    });

  const publicIP = await getPublicIP();

  const socket = new net.Socket();
  const timeoutMs = 5000;

  socket.setTimeout(timeoutMs);

  socket.once("connect", () => {
    socket.destroy();
    res.json({
      ok: true,
      note: "TCP connect OK (porta aperta)",
      host,
      port: dbPort,
      publicIP,
      timestamp: startTime
    });
  });

  socket.once("timeout", () => {
    socket.destroy();
    res.status(504).json({
      ok: false,
      error: "ETIMEDOUT (probabile porta chiusa/firewall)",
      host,
      port: dbPort,
      publicIP,
      timestamp: startTime
    });
  });

  socket.once("error", (err) => {
    res.status(500).json({
      ok: false,
      error: String(err.message || err),
      host,
      port: dbPort,
      publicIP,
      timestamp: startTime
    });
  });

  try {
    socket.connect(dbPort, host);
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: String(e.message || e),
      host,
      port: dbPort,
      publicIP,
      timestamp: startTime
    });
  }
});

// Elenco tabelle visibili nel DB
app.get("/db-tables", async (_req, res) => {
  try {
    const [rows] = await pool.query("SHOW TABLES");
    res.json({ ok: true, tables: rows });
  } catch (err) {
    console.error("[DB] /db-tables error:", err);
    res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

// Sample dalla tabella applications (debug)
app.get("/db-applications-sample", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM applications LIMIT 10");
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    console.error("[DB] /db-applications-sample error:", err);
    res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

// Endpoint di debug: restituisce la combinazione cerchio-auto e le omologazioni
app.get("/fitment-debug", async (req, res) => {
  try {
    const carId = parseInt(req.query.car, 10);
    const wheelId = parseInt(req.query.wheel, 10);

    if (!carId || !wheelId) {
      return res.status(400).json({
        ok: false,
        error: "Parametri mancanti. Usa /fitment-debug?car=ID_CAR&wheel=ID_WHEEL"
      });
    }

    const [rows] = await pool.query(
      `SELECT
         id,
         car,
         am_wheel,
         centering_ring,
         bolt_nut,
         homologation_tuv, homologation_tuv_doc, note_tuv,
         homologation_kba, homologation_kba_doc, note_kba,
         homologation_ece, homologation_ece_doc, note_ece,
         homologation_jwl, homologation_jwl_doc,
         homologation_ita, homologation_ita_doc, note_ita,
         limitation, limitation_IT,
         fitment_type,
         fitment_advice,
         plug_play,
         created_at,
         updated_at
       FROM applications
       WHERE car = ? AND am_wheel = ?
       LIMIT 1`,
      [carId, wheelId]
    );

    if (!rows.length) {
      return res.json({
        ok: false,
        error: "Nessuna combinazione trovata per questi ID",
        carId,
        wheelId
      });
    }

    const row = rows[0];

    const homologationsDbg = [];

    if (row.homologation_tuv) {
      homologationsDbg.push({
        type: "TUV",
        code: row.homologation_tuv,
        doc: row.homologation_tuv_doc || null,
        note: row.note_tuv || null
      });
    }
    if (row.homologation_kba) {
      homologationsDbg.push({
        type: "KBA",
        code: row.homologation_kba,
        doc: row.homologation_kba_doc || null,
        note: row.note_kba || null
      });
    }
    if (row.homologation_ece) {
      homologationsDbg.push({
        type: "ECE",
        code: row.homologation_ece,
        doc: row.homologation_ece_doc || null,
        note: row.note_ece || null
      });
    }
    if (row.homologation_jwl) {
      homologationsDbg.push({
        type: "JWL",
        code: row.homologation_jwl,
        doc: row.homologation_jwl_doc || null,
        note: null
      });
    }
    if (row.homologation_ita) {
      homologationsDbg.push({
        type: "ITA",
        code: row.homologation_ita,
        doc: row.homologation_ita_doc || null,
        note: row.note_ita || null
      });
    }

    return res.json({
      ok: true,
      carId,
      wheelId,
      fitment: {
        fitment_type: row.fitment_type,
        fitment_advice: row.fitment_advice,
        limitation: row.limitation,
        limitation_IT: row.limitation_IT,
        plug_play: !!row.plug_play
      },
      homologations: homologationsDbg,
      raw: row
    });
  } catch (err) {
    console.error("[DB] /fitment-debug error:", err);
    res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

app.post("/fitment", async (req, res) => {
  try {
    const { carId, wheelId } = req.body;

    if (!carId || !wheelId) {
      return res.status(400).json({
        ok: false,
        error: "Parametri mancanti. Devi inviare carId e wheelId."
      });
    }

    const [rows] = await pool.query(
      `SELECT
         id,
         car,
         am_wheel,
         centering_ring,
         bolt_nut,
         homologation_tuv, homologation_tuv_doc, note_tuv,
         homologation_kba, homologation_kba_doc, note_kba,
         homologation_ece, homologation_ece_doc, note_ece,
         homologation_jwl, homologation_jwl_doc,
         homologation_ita, homologation_ita_doc, note_ita,
         limitation, limitation_IT,
         fitment_type,
         fitment_advice,
         plug_play
       FROM applications
       WHERE car = ? AND am_wheel = ?
       LIMIT 1`,
      [carId, wheelId]
    );

    if (!rows.length) {
      return res.json({
        ok: false,
        error: "Nessuna combinazione trovata",
        carId,
        wheelId
      });
    }

    const row = rows[0];
    const homologations = [];

    if (row.homologation_tuv)
      homologations.push({ type: "TUV", code: row.homologation_tuv });
    if (row.homologation_kba)
      homologations.push({ type: "KBA", code: row.homologation_kba });
    if (row.homologation_ece)
      homologations.push({ type: "ECE", code: row.homologation_ece });
    if (row.homologation_jwl)
      homologations.push({ type: "JWL", code: row.homologation_jwl });
    if (row.homologation_ita)
      homologations.push({ type: "ITA", code: row.homologation_ita });

    res.json({
      ok: true,
      carId,
      wheelId,
      fitment: {
        type: row.fitment_type,
        advice: row.fitment_advice,
        limitation: row.limitation,
        limitation_IT: row.limitation_IT,
        plugAndPlay: !!row.plug_play
      },
      homologations
    });
  } catch (err) {
    console.error("[DB] /fitment error:", err);
    res.status(500).json({
      ok: false,
      error: String(err?.message || err)
    });
  }
});