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
  apiKey: process.env.OPENAI_API_KEY,
});

// Modello principale GPT-4o
const OPENAI_MAIN_MODEL = process.env.OPENAI_MAIN_MODEL || "gpt-4o";

// Modello analisi (GPT-4o-mini)
const OPENAI_ANALYSIS_MODEL =
  process.env.OPENAI_ANALYSIS_MODEL || "gpt-4o-mini";

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
- Se l’utente fornisce marca, modello e anno, devi SEMPRE proporre almeno 3, 4 o 5 modelli reali compatibili presi dal database.
- Non rimandare l’utente al sito: è già sul sito.
- Puoi nominare il configuratore 3D solo se serve per vedere l’anteprima.
- Le finiture devono essere indicate **con il loro nome ufficiale**.
- Le larghezze dei canali devono essere espresse senza la “J” finale.

COMPORTAMENTO PER I CASI D'USO PRINCIPALI

1) L'utente vuole sapere quali cerchi montano sulla sua auto.
   - Prima di rispondere, fai domande mirate per raccogliere i dati minimi:
     - Marca
     - Modello
     - Anno
   - Se hai dati tecnici strutturati per quell'auto:
     - Spiega quali cerchi risultano compatibili e in che configurazione (es. diametri, canali, ET, eventuali limitazioni).
   - Se NON hai dati strutturati sufficienti:
     - Dai comunque qualche indicazione generale (es. quali diametri sono più frequenti su quel tipo di vettura, differenze estetiche tra misure).
     - Spiega quali informazioni mancano per essere precisi.
     - Solo alla fine invita l'utente a usare il configuratore 3D sul nostro sito, spiegando brevemente cosa gli permetterà di vedere.

2) L'utente vuole sapere quali cerchi gli consigli per la sua auto.
   - Prima raccogli gli stessi dati del punto 1 (marca, modello).
   - Se hai dati tecnici strutturati, usa quelli per proporre cerchi effettivamente compatibili.
   - Consiglia i modelli più recenti prima.
   - Quando fai una proposta, spiega in modo sintetico:
     - perché quel modello di cerchio è adatto (stile, uso, dimensioni),
     - in che diametri/finiture è disponibile (queste informazioni prendile solo ed esclusivamente dalle pagine del sito).
   - Non consigliare mai cerchi non presenti nel catalogo Fondmetal o sul sito Fondmetal.

3) L'utente vuole sapere quali cerchi sono omologati per la sua auto.
   - Raccogli sempre prima i dati di identificazione della vettura (marca, modello, anno).
   - Se nei dati tecnici strutturati ci sono informazioni di omologazione (ECE, TUV, KBA, JWL, NAD):
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
   - Chiedi all'utente di che cerchio si tratta (nome modello e, se possibile, diametro).
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
   - Se la domanda è generica (es. "cos'è l'ET?"), fornisce una spiegazione tecnica semplice e neutra, collegandola se possibile ai cerchi Fondmetal.
   - Se la domanda riguarda uno specifico modello di cerchio e hai dati strutturati, utilizza quei dati per dare una risposta precisa.

GESTIONE DEL DIALOGO
- Quando mancano informazioni importanti per dare una risposta precisa, NON andare subito al configuratore:
  - fai 1 o 2 domande (al massimo) mirate per completare il quadro;
  - solo dopo, se ancora non è possibile essere specifici, suggerisci il configuratore o il contatto diretto.
- Non fare mai domande inutili: concentrati su quelli che servono davvero (marca, modello, anno, cerchio, dimensioni).
- Ogni volta che cambi argomento (es. da compatibilità a consigli estetici), chiarisci cosa stai facendo.
- NON devi mai dire “visita il nostro sito” o “guarda sul nostro sito”: l’utente è già sul sito. Se serve, puoi dire “nel configuratore puoi visualizzare l’anteprima”.

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

REGOLE TECNICHE DI MASSIMA PRIORITÀ (OBBLIGATORIE)
1. Compatibilità cerchio/auto:
   - Una combinazione auto+cerchio è compatibile SOLO se esiste una riga
     nella tabella 'applications' che collega la versione auto (car_versions)
     all'am_wheel corretto (am_wheel_versions → am_wheels).
   - Se NON esiste una riga applicativa nel DB, considera la combinazione
     NON compatibile al 100%.
2. Catalogo ufficiale:
   - Devi proporre e utilizzare SOLO cerchi presenti in 'am_wheels'
     con status = 'ACTIVE'.
   - Tutti gli altri cerchi NON devono essere proposti.
3. Diametri e finiture:
   - Un cerchio è disponibile SOLO nei diametri che appaiono in 'am_wheels'
     e nelle finiture presenti in 'am_wheel_versions'.
   - Se la misura o finitura non è presente nel DB → NON ESISTE.
   - Non devi mai generare diametri o finiture non presenti.
4. Risposte:
   - Non usare più termini come "potrebbe", "in generale", "di solito".
   - Se un cerchio NON è compatibile → devi dirlo in modo diretto al 100%:
     "Il cerchio X nel diametro Y NON risulta compatibile con la tua auto
      secondo i dati ufficiali Fondmetal."
`;

// Memoria persistente (per processo) di contesto strutturato e cronologia
const userContext = new Map();
const chatHistory = new Map();

const MARKDOWN_TEMPLATES = {
  header: (car) => `**FondmetalAI – Cerchi per la tua ${car}**`,

  compatibili: (lista) =>
    lista.length
      ? `**Cerchi compatibili trovati:**\n${lista
          .map((m) => `• **${m}**`)
          .join("\n")}`
      : "Nessun cerchio compatibile trovato con i dati attuali.",

  diametri: (text) => `**Misure disponibili**\n${text}`,

  finiture: (text) => `**Finiture ufficiali**\n${text}`,

  omologazioni: (text) =>
    text.includes("nessuna omologazione")
      ? "Nessuna omologazione trovata per questa auto."
      : `**Omologazioni e dettagli**\n${text}`,

  plugplay: (yes) =>
    yes
      ? "Plug & Play – montaggio diretto"
      : "Potrebbe richiedere centraggi o distanziali",

  consiglio: (modello, motivo) => `Ti consiglio il **${modello}**: ${motivo}`,

  nofitment: (auto, cerchio, misura) =>
    `La combinazione **${auto}** con il cerchio **${cerchio} ${misura}"** **NON risulta compatibile** secondo i dati ufficiali Fondmetal.\n\nNon è possibile montarlo in sicurezza senza modifiche strutturali.`,

  chiedi: (cosa) => `\nPer darti una risposta precisa, dimmi:\n${cosa}`,
};

// =========================
// ANALISI RICHIESTA (INTENT + PARAMETRI)
// =========================
async function analyzeUserRequest(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_ANALYSIS_MODEL,
      messages: [
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
          `,
        },
        { role: "user", content: message },
      ],
      temperature: 0,
    });
    const raw = completion.choices[0]?.message?.content?.trim() || "";
    console.log("Raw analyzeUserRequest:", raw);
    let jsonText = raw;
    const fencedMatch = raw.match(/```(?:json)?([\s\S]*?)```/i);
    if (fencedMatch?.[1]) jsonText = fencedMatch[1].trim();
    const braceMatch = jsonText.match(/\{[\s\S]*\}/);
    if (braceMatch) jsonText = braceMatch[0];
    const parsed = JSON.parse(jsonText);
    let year = parsed.year ?? null;
    if (typeof year === "string") {
      const m = year.match(/(19|20)\d{2}/);
      year = m ? parseInt(m[0], 10) : null;
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
      extra: parsed.extra ?? null,
    };
  } catch (err) {
    console.error("Errore analyzeUserRequest:", err);
    return { intent: "other" };
  }
}

// =========================
// FUNZIONI DB DI SUPPORTO
// =========================
async function findManufacturerId(name) {
  const [rows] = await pool.query(
    "SELECT id FROM car_manufacturers WHERE LOWER(manufacturer) LIKE LOWER(?) LIMIT 1",
    [`%${name}%`]
  );
  return rows.length ? rows[0].id : null;
}

async function findModelId(manufacturerId, modelName) {
  const [rows] = await pool.query(
    "SELECT id FROM car_models WHERE manufacturer = ? AND model LIKE ? LIMIT 1",
    [manufacturerId, `%${modelName}%`]
  );
  return rows.length ? rows[0].id : null;
}

async function findCarVersionIdByLabel(modelId, versionName) {
  const [rows] = await pool.query(
    "SELECT id FROM car_versions WHERE car = ? AND version LIKE ? LIMIT 1",
    [modelId, `%${versionName}%`]
  );
  return rows.length ? rows[0].id : null;
}

async function findWheelModelId(modelName) {
  const [rows] = await pool.query(
    "SELECT id FROM am_wheel_models WHERE model LIKE ? LIMIT 1",
    [`%${modelName}%`]
  );
  return rows.length ? rows[0].id : null;
}

async function findWheelVersionId(wheelModelId, diameter) {
  const dia =
    typeof diameter === "string"
      ? parseInt(String(diameter).replace(/\D+/g, ""), 10)
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
  return rows.length ? rows[0] : null;
}

// === FIXATA E DINAMICA ===
async function getFitmentData(brand, model, wheelModelName, diameter) {
  const dia =
    typeof diameter === "string"
      ? parseInt(String(diameter).replace(/\D+/g, ""), 10)
      : Number(diameter);

  if (!dia || Number.isNaN(dia) || !brand || !model || !wheelModelName)
    return null;

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        appl.plug_play,
        appl.fitment_type,
        appl.limitation_IT,
        appl.homologation_tuv,
        appl.homologation_kba,
        appl.homologation_ece,
        appl.homologation_jwl,
        appl.homologation_ita
      FROM mod_combined_full_10 mcf
      JOIN applications appl ON mcf.applications_id = appl.id
      JOIN am_wheels aw ON appl.am_wheel = aw.id 
        AND aw.status = 'ACTIVE' 
        AND aw.diameter = ?
      JOIN am_wheel_models awm ON aw.model = awm.id 
        AND awm.model = ?
      JOIN am_wheel_lines awl ON awm.line = awl.id 
        AND awl.id = 22  -- Fondmetal ufficiale
      WHERE mcf.car_manufacturers_manufacturer LIKE ?
        AND mcf.car_models_model LIKE ?
      LIMIT 1
    `,
      [dia, wheelModelName, `%${brand}%`, `%${model}%`]
    );

    console.log(
      `[OK] Fitment preciso per ${brand} ${model} + ${wheelModelName} ${dia}" → ${
        rows.length ? "TROVATO" : "non trovato"
      }`
    );
    return rows.length ? rows[0] : null;
  } catch (err) {
    console.warn("Errore getFitmentData:", err.message);
    return null;
  }
}

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
       AND w.status = 'ACTIVE'
     GROUP BY m.id
     LIMIT 1`,
    [`%${wheelName}%`]
  );
  return rows.length ? rows[0] : null;
}

// === VERSIONE FINALE CON DIAMETRI REALI ===
async function getWheelModelsForCarModel(modelId) {
  try {
    const [carInfo] = await pool.query(
      `
      SELECT man.manufacturer, cm.model 
      FROM car_models cm
      JOIN car_manufacturers man ON cm.manufacturer = man.id
      WHERE cm.id = ?
    `,
      [modelId]
    );

    if (!carInfo.length) return [];

    const brand = carInfo[0].manufacturer;
    const modelName = carInfo[0].model;

    const [rows] = await pool.query(
      `
      SELECT 
        awm.model AS model_name,
        GROUP_CONCAT(DISTINCT aw.diameter ORDER BY aw.diameter) AS available_diameters
      FROM mod_combined_full_10 mcf
      JOIN am_wheels aw ON mcf.am_wheels_id = aw.id AND aw.status = 'ACTIVE'
      JOIN am_wheel_models awm ON aw.model = awm.id
      JOIN am_wheel_lines awl ON awm.line = awl.id AND awl.id = 22
      WHERE mcf.car_manufacturers_manufacturer LIKE ?
        AND mcf.car_models_model LIKE ?
      GROUP BY awm.id, awm.model
      ORDER BY MAX(aw.diameter) DESC
      LIMIT 12
    `,
      [`%${brand}%`, `%${modelName}%`]
    );

    return rows.map((r) => ({
      model_name: r.model_name,
      available_diameters: r.available_diameters
        ? r.available_diameters.split(",").map(Number)
        : [],
    }));
  } catch (err) {
    console.warn("Errore getWheelModelsForCarModel:", err.message);
    return [];
  }
}

// === FUNZIONE DEFINITIVA: auto compatibili con un certo cerchio Fondmetal ===
async function getCarsForWheel(wheelName, diameter) {
  const dia =
    typeof diameter === "string"
      ? parseInt(String(diameter).replace(/\D+/g, ""), 10)
      : Number(diameter);

  if (!dia || Number.isNaN(dia)) return [];

  try {
    const [rows] = await pool.query(
      `
      SELECT DISTINCT
        mcf.car_manufacturers_manufacturer AS manufacturer_name,
        mcf.car_models_model AS model_name,
        mcf.cars_production_time_start AS year_start,
        mcf.cars_production_time_stop AS year_stop
      FROM mod_combined_full_10 mcf
      JOIN am_wheels aw ON mcf.am_wheels_id = aw.id
        AND aw.status = 'ACTIVE'
        AND aw.diameter = ?
      JOIN am_wheel_models awm ON aw.model = awm.id
        AND awm.model = ?
      JOIN am_wheel_lines awl ON awm.line = awl.id
        AND awl.id = 22 -- Solo Fondmetal ufficiale
      ORDER BY
        mcf.car_manufacturers_manufacturer,
        mcf.car_models_model
      LIMIT 100
    `,
      [dia, wheelName]
    );

    console.log(
      `[OK] Auto per cerchio ${wheelName} ${dia}": ${rows.length} modelli trovati`
    );
    return rows;
  } catch (err) {
    console.warn("Errore getCarsForWheel:", err.message);
    return [];
  }
}

// === OMOLOGAZIONI per famiglia auto ===
async function getHomologationsByCarModel(modelId) {
  try {
    const [carInfo] = await pool.query(
      `
      SELECT man.manufacturer, cm.model FROM car_models cm
      JOIN car_manufacturers man ON cm.manufacturer = man.id
      WHERE cm.id = ?
    `,
      [modelId]
    );

    if (!carInfo.length) return [];

    const [rows] = await pool.query(
      `
      SELECT
        awm.model AS wheel_model,
        aw.diameter,
        MAX(appl.homologation_tuv) AS homologation_tuv,
        MAX(appl.homologation_kba) AS homologation_kba,
        MAX(appl.homologation_ece) AS homologation_ece,
        MAX(appl.homologation_jwl) AS homologation_jwl,
        MAX(appl.homologation_ita) AS homologation_ita
      FROM mod_combined_full_10 mcf
      JOIN applications appl ON mcf.applications_id = appl.id
      JOIN am_wheels aw ON appl.am_wheel = aw.id AND aw.status = 'ACTIVE'
      JOIN am_wheel_models awm ON aw.model = awm.id
      JOIN am_wheel_lines awl ON awm.line = awl.id AND awl.id = 22
      WHERE mcf.car_manufacturers_manufacturer LIKE ?
        AND mcf.car_models_model LIKE ?
      GROUP BY awm.model, aw.diameter
      ORDER BY awm.model, aw.diameter
    `,
      [`%${carInfo[0].manufacturer}%`, `%${carInfo[0].model}%`]
    );

    return rows;
  } catch (err) {
    console.warn("Errore getHomologationsByCarModel:", err.message);
    return [];
  }
}

// === FINITURE REALI (nome leggibile) ===
async function getWheelFinishesForCarModel(modelId) {
  try {
    const [carInfo] = await pool.query(
      `
      SELECT man.manufacturer, cm.model 
      FROM car_models cm
      JOIN car_manufacturers man ON cm.manufacturer = man.id
      WHERE cm.id = ?
    `,
      [modelId]
    );

    if (!carInfo.length) return [];

    const brand = carInfo[0].manufacturer;
    const modelName = carInfo[0].model;

    const [rows] = await pool.query(
      `
      SELECT 
        awm.model AS model_name,
        aw.diameter,
        GROUP_CONCAT(DISTINCT f.name ORDER BY f.name SEPARATOR ', ') AS finishes
      FROM mod_combined_full_10 mcf
      JOIN am_wheels aw ON mcf.am_wheels_id = aw.id AND aw.status = 'ACTIVE'
      JOIN am_wheel_models awm ON aw.model = awm.id
      JOIN am_wheel_lines awl ON awm.line = awl.id AND awl.id = 22
      JOIN am_wheel_versions v ON v.am_wheel = aw.id
      JOIN finishes f ON v.finish = f.id
      WHERE mcf.car_manufacturers_manufacturer LIKE ?
        AND mcf.car_models_model LIKE ?
        AND f.name IS NOT NULL AND f.name != ''
      GROUP BY awm.model, aw.diameter
      ORDER BY awm.model, aw.diameter
    `,
      [`%${brand}%`, `%${modelName}%`]
    );

    // Raggruppa per modello con finiture uniche
    const result = {};
    rows.forEach((r) => {
      if (!result[r.model_name]) {
        result[r.model_name] = {
          model_name: r.model_name,
          finishes: new Set(),
        };
      }
      if (r.finishes) {
        r.finishes
          .split(", ")
          .forEach((f) => result[r.model_name].finishes.add(f));
      }
    });

    return Object.values(result).map((item) => ({
      model_name: item.model_name,
      finishes: Array.from(item.finishes).sort().join(" | "),
    }));
  } catch (err) {
    console.warn("Errore getWheelFinishesForCarModel:", err.message);
    return [];
  }
}

// === OMOLOGAZIONI REALI per modello auto (famiglia) ===
async function getHomologationsForCarModel(modelId) {
  try {
    const [carInfo] = await pool.query(
      `
      SELECT man.manufacturer, cm.model 
      FROM car_models cm
      JOIN car_manufacturers man ON cm.manufacturer = man.id
      WHERE cm.id = ?
    `,
      [modelId]
    );

    if (!carInfo.length) return [];

    const brand = carInfo[0].manufacturer;
    const modelName = carInfo[0].model;

    const [rows] = await pool.query(
      `
      SELECT 
        awm.model AS cerchio,
        aw.diameter AS diametro,
        aw.width AS canale,
        aw.et AS offset,
        appl.homologation_tuv,
        appl.homologation_kba,
        appl.homologation_ece,
        appl.homologation_jwl,
        appl.homologation_ita,
        appl.plug_play,
        appl.limitation_IT
      FROM mod_combined_full_10 mcf
      JOIN applications appl ON mcf.applications_id = appl.id
      JOIN am_wheels aw ON appl.am_wheel = aw.id AND aw.status = 'ACTIVE'
      JOIN am_wheel_models awm ON aw.model = awm.id
      JOIN am_wheel_lines awl ON awm.line = awl.id AND awl.id = 22
      WHERE mcf.car_manufacturers_manufacturer LIKE ?
        AND mcf.car_models_model LIKE ?
        AND (
          appl.homologation_tuv != '' OR
          appl.homologation_kba != '' OR
          appl.homologation_ece != '' OR
          appl.homologation_jwl != '' OR
          appl.homologation_ita != ''
        )
      ORDER BY awm.model, aw.diameter
      LIMIT 200
    `,
      [`%${brand}%`, `%${modelName}%`]
    );

    // Formatta in modo leggibile per il GPT
    const result = rows.map((r) => {
      const omologazioni = [];
      if (r.homologation_tuv) omologazioni.push("TÜV");
      if (r.homologation_kba) omologazioni.push("KBA");
      if (r.homologation_ece) omologazioni.push("ECE");
      if (r.homologation_jwl) omologazioni.push("JWL");
      if (r.homologation_ita) omologazioni.push("NAD/ITA");

      return {
        cerchio: r.cerchio,
        misura: `${r.diametro}" ${r.canale}J ET${r.et}`,
        omologazioni: omologazioni.join(" | ") || "nessuna",
        plug_play: r.plug_play
          ? "Plug & Play"
          : "potrebbe richiedere modifiche",
        limitazioni: r.limitation_IT || "nessuna",
      };
    });

    return result;
  } catch (err) {
    console.warn("Errore getHomologationsForCarModel:", err.message);
    return [];
  }
}

// ===================================================
// CHATBOT /chat
// ===================================================
app.post("/chat", async (req, res) => {
  const startTime = Date.now();
  const log = (...args) =>
    console.log(`\x1b[36m[DEBUG ${new Date().toISOString()}]\x1b[0m`, ...args);

  try {
    const userMessage = req.body.message?.trim();
    const userId = req.body.userId || "default";

    log("NUOVA RICHIESTA /chat");
    log("userId:", userId);
    log("Messaggio utente:", userMessage);

    if (!userMessage) {
      return res.status(400).json({ error: "Messaggio vuoto." });
    }

    // Contesto e cronologia
    const history = chatHistory.get(userId) || [];
    const ctxBefore = userContext.get(userId) || {};
    log("Contesto precedente:", ctxBefore);

    // === ANALISI INTENT ===
    let messageForAnalysis = userMessage;
    const hasCarCtx = !!(
      ctxBefore.brand ||
      ctxBefore.model ||
      ctxBefore.year ||
      ctxBefore.version
    );
    const hasWheelCtx = !!(ctxBefore.wheel || ctxBefore.diameter);

    if (hasCarCtx || hasWheelCtx) {
      messageForAnalysis =
        "Dati già noti sull'auto e sui cerchi (non chiederli di nuovo se non vengono cambiati esplicitamente):\n" +
        `- Marca: ${ctxBefore.brand || "non specificata"}\n` +
        `- Modello: ${ctxBefore.model || "non specificato"}\n` +
        `- Anno: ${ctxBefore.year || "non specificato"}\n` +
        `- Versione: ${ctxBefore.version || "non specificata"}\n\n` +
        "Cerchio richiesto:\n" +
        `- Modello: ${ctxBefore.wheel || "non specificato"}\n` +
        `- Diametro: ${ctxBefore.diameter || "non specificato"}\n\n` +
        "Nuovo messaggio dell'utente:\n" +
        userMessage;
    }

    const lastLongUser = [...history]
      .reverse()
      .find((m) => m.role === "user" && m.content?.length > 20);
    if (
      userMessage.length < 6 &&
      !/[a-zA-Z]/.test(userMessage) &&
      lastLongUser
    ) {
      const header =
        hasCarCtx || hasWheelCtx
          ? `Dati già noti:\nMarca: ${ctxBefore.brand || "-"}\nModello: ${
              ctxBefore.model || "-"
            }\nAnno: ${ctxBefore.year || "-"}\n`
          : "";
      messageForAnalysis = `${header}Ultimo messaggio lungo:\n${lastLongUser.content}\n\nFollow-up breve: ${userMessage}`;
    }

    log(
      "Messaggio inviato a analyzeUserRequest:",
      messageForAnalysis.substring(0, 500) +
        (messageForAnalysis.length > 500 ? "..." : "")
    );

    let analysis = await analyzeUserRequest(messageForAnalysis);
    log("ANALISI INTENT COMPLETA:", JSON.stringify(analysis, null, 2));

    // Aggiornamento contesto
    const ctxUpdated = { ...ctxBefore };
    if (analysis.brand) ctxUpdated.brand = analysis.brand;
    if (analysis.model) ctxUpdated.model = analysis.model;
    if (analysis.year) ctxUpdated.year = analysis.year;
    if (analysis.version) ctxUpdated.version = analysis.version;
    if (analysis.wheel) ctxUpdated.wheel = analysis.wheel;
    if (analysis.diameter) ctxUpdated.diameter = analysis.diameter;
    userContext.set(userId, ctxUpdated);
    log("Contesto aggiornato:", ctxUpdated);

    // Alias
    const carBrand = ctxUpdated.brand;
    const carModel = ctxUpdated.model;
    const carYear = ctxUpdated.year;
    const carVersion = ctxUpdated.version;
    const wheelModelName = ctxUpdated.wheel;
    const wheelDiameter = ctxUpdated.diameter;

    // Variabili risultato
    let fitmentRow = null;
    let homologations = [];
    let fitmentSummary = null;
    let wheelInfoSummary = null;
    let carWheelOptions = null;
    let wheelFitmentCars = null;
    let carHomologations = null;
    let needMoreCarData = false;
    let needMoreWheelData = false;
    let carWheelFinishes = [];

    // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

    // 1. Info cerchio singolo
    if (analysis.intent === "wheel_info" && wheelModelName) {
      wheelInfoSummary = await getWheelBasicInfo(wheelModelName);
    }

    // 2. Su quali auto va questo cerchio?
    if (analysis.intent === "fitment_by_wheel") {
      if (!wheelModelName || !wheelDiameter) {
        needMoreWheelData = true;
      } else {
        wheelFitmentCars = await getCarsForWheel(wheelModelName, wheelDiameter);
      }
    }

    // 3. Intent legati all'auto
    const isCarFitmentIntent = [
      "fitment_by_car",
      "recommendation_by_car",
      "omologation_by_car",
    ].includes(analysis.intent);
    let manufacturerId = null;
    let modelId = null;

    if (isCarFitmentIntent) {
      if (!carBrand || !carModel || (!carYear && !carVersion)) {
        needMoreCarData = true;
      }

      if (carBrand && carModel) {
        manufacturerId = await findManufacturerId(carBrand);
        if (manufacturerId) {
          modelId = await findModelId(manufacturerId, carModel);
        }

        if (modelId) {
          carWheelOptions = await getWheelModelsForCarModel(modelId);
          carWheelFinishes = await getWheelFinishesForCarModel(modelId);
          log(`Finiture trovate:`, carWheelFinishes);
          carHomologations = await getHomologationsForCarModel(modelId);
          log(`Omologazioni caricate: ${carHomologations.length} combinazioni`);

          if (analysis.intent === "omologation_by_car") {
            carHomologations = await getHomologationsByCarModel(modelId);
          }
        }
      }

      // Fitment preciso (auto + cerchio specifico)
      if (
        carBrand &&
        carModel &&
        carVersion &&
        wheelModelName &&
        wheelDiameter &&
        modelId
      ) {
        fitmentRow = await getFitmentData(
          carBrand,
          carModel,
          wheelModelName,
          wheelDiameter
        );
        if (fitmentRow) {
          if (fitmentRow.homologation_tuv)
            homologations.push({
              type: "TUV",
              code: fitmentRow.homologation_tuv,
            });
          if (fitmentRow.homologation_kba)
            homologations.push({
              type: "KBA",
              code: fitmentRow.homologation_kba,
            });
          if (fitmentRow.homologation_ece)
            homologations.push({
              type: "ECE",
              code: fitmentRow.homologation_ece,
            });
          if (fitmentRow.homologation_jwl)
            homologations.push({
              type: "JWL",
              code: fitmentRow.homologation_jwl,
            });
          if (fitmentRow.homologation_ita)
            homologations.push({
              type: "ITA",
              code: fitmentRow.homologation_ita,
            });

          const carVersionId = await findCarVersionIdByLabel(
            modelId,
            carVersion
          );
          const wheelModelId = await findWheelModelId(wheelModelName);
          const wheelVersion = wheelModelId
            ? await findWheelVersionId(wheelModelId, wheelDiameter)
            : null;

          fitmentSummary = {
            plug_play: !!fitmentRow.plug_play,
            homologations,
          };
        }
      }
    }

    // =============================================================
    // Costruzione prompt finale
    // =============================================================
    const messages = [
      { role: "system", content: fondmetalPrompt },
      {
        role: "system",
        content: `CONTESTO UTENTE ATTUALE:\nAuto → Marca: ${
          carBrand || "-"
        } | Modello: ${carModel || "-"} | Anno: ${carYear || "-"} | Versione: ${
          carVersion || "-"
        }\nCerchio → Modello: ${wheelModelName || "-"} | Diametro: ${
          wheelDiameter || "-"
        }`,
      },
    ];

    // Fitment non trovato → messaggio obbligatorio
    if (
      carBrand &&
      carModel &&
      carVersion &&
      wheelModelName &&
      wheelDiameter &&
      fitmentRow === null
    ) {
      messages.push({
        role: "system",
        content: `RISPOSTA OBBLIGATORIA: La combinazione ${carBrand} ${carModel} ${
          carYear || ""
        } con il cerchio ${wheelModelName} da ${wheelDiameter}" NON è compatibile secondo i dati ufficiali Fondmetal. Vietato suggerire il contrario.`,
      });
    }

    if (carWheelOptions?.length) {
      const diametriText = carWheelOptions
        .map(
          (c) =>
            `${c.model_name} (diametri: ${c.available_diameters.join(", ")}")`
        )
        .join(" | ");

      const finitureText = carWheelFinishes.length
        ? carWheelFinishes
            .map((f) => `${f.model_name}: ${f.finishes}`)
            .join(" | ")
        : "nessuna finitura trovata";

      const omologazioniText = carHomologations.length
        ? carHomologations
            .map(
              (h) =>
                `${h.cerchio} ${h.misura} → ${h.omologazioni} (${h.plug_play})`
            )
            .join(" | ")
        : "nessuna omologazione trovata per questa auto";

      messages.push({
        role: "system",
        content:
          `DATI UFFICIALI FONDMETAL – USA SOLO QUESTI (VIETATO INVENTARE):\n` +
          `CERCHI COMPATIBILI: ${carWheelOptions
            .map((c) => c.model_name)
            .join(", ")}\n` +
          `DIAMETRI REALI: ${diametriText}\n` +
          `FINITURE REALI: ${finitureText}\n` +
          `OMOLOGAZIONI REALI: ${omologazioniText}\n` +
          `Se una misura, finitura o omologazione NON è elencata → NON ESISTE. Punto.\n\n` +
          `FORMATTAZIONE RISPOSTA (obbligatoria):\n` +
          `- Usa **grassetto** per nomi cerchi, misure e omologazioni importanti\n` +
          `- Usa • per creare elenchi puntati\n` +
          `- Separa le sezioni con una riga vuota\n` +
          `- Usa titoli chiari come "Cerchi compatibili", "Diametri disponibili", ecc.`,
      });

      console.log("PASSATE AL GPT → Omologazioni reali:", omologazioniText);
    }

    // Altri dati (wheel info, omologazioni, ecc.)
    if (wheelInfoSummary)
      messages.push({
        role: "system",
        content: `INFO CERCHIO: ${wheelInfoSummary.model_name} – Diametri: ${wheelInfoSummary.diameters} – Finiture: ${wheelInfoSummary.finishes}`,
      });
    if (fitmentSummary)
      messages.push({
        role: "system",
        content: `FITMENT PRECISO: Plug&Play=${
          fitmentSummary.plug_play
        } | Omologazioni: ${homologations.map((h) => h.type).join(", ")}`,
      });
    if (wheelFitmentCars?.length)
      messages.push({
        role: "system",
        content: `Questo cerchio è omologato per: ${wheelFitmentCars
          .map((c) => c.manufacturer_name + " " + c.model_name)
          .slice(0, 10)
          .join(", ")}${wheelFitmentCars.length > 10 ? " e altri" : ""}`,
      });

    if (isCarFitmentIntent && needMoreCarData)
      messages.push({
        role: "system",
        content: "Mancano marca, modello o anno → chiedili.",
      });
    if (needMoreWheelData)
      messages.push({
        role: "system",
        content: "Manca modello cerchio o diametro → chiedili.",
      });

    messages.push({ role: "user", content: userMessage });

    // Chiamata OpenAI
    const completion = await openai.chat.completions.create({
      model: OPENAI_MAIN_MODEL,
      messages,
      temperature: 0.2,
    });

    const reply = completion.choices[0].message.content;

    // Aggiornamento cronologia
    const updatedHistory = [
      ...history,
      { role: "user", content: userMessage },
      { role: "assistant", content: reply },
    ].slice(-20);
    chatHistory.set(userId, updatedHistory);

    res.json({
      reply,
      debug: {
        intent: analysis.intent,
        context: ctxUpdated,
        durationMs: Date.now() - startTime,
      },
    });

    log(`FINE RICHIESTA (${Date.now() - startTime}ms)`);
  } catch (error) {
    log("ERRORE /chat:", error);
    res.status(500).json({ error: "Errore interno" });
  }
});

// =========================
// HEALTHCHECK & DEBUG (tutto originale)
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
      timestamp: startTime,
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
      timestamp: startTime,
    });
  });

  socket.once("error", (err) => {
    res.status(500).json({
      ok: false,
      error: String(err.message || err),
      host,
      port: dbPort,
      publicIP,
      timestamp: startTime,
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
      timestamp: startTime,
    });
  }
});

app.get("/db-tables", async (_req, res) => {
  try {
    const [rows] = await pool.query("SHOW TABLES");
    res.json({ ok: true, tables: rows });
  } catch (err) {
    console.error("[DB] /db-tables error:", err);
    res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

app.get("/db-applications-sample", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM applications LIMIT 10");
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    console.error("[DB] /db-applications-sample error:", err);
    res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

app.get("/fitment-debug", async (req, res) => {
  try {
    const carId = parseInt(req.query.car, 10);
    const wheelId = parseInt(req.query.wheel, 10);

    if (!carId || !wheelId) {
      return res.status(400).json({
        ok: false,
        error:
          "Parametri mancanti. Usa /fitment-debug?car=ID_CAR&wheel=ID_WHEEL",
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
        wheelId,
      });
    }

    const row = rows[0];

    const homologationsDbg = [];

    if (row.homologation_tuv) {
      homologationsDbg.push({
        type: "TUV",
        code: row.homologation_tuv,
        doc: row.homologation_tuv_doc || null,
        note: row.note_tuv || null,
      });
    }
    if (row.homologation_kba) {
      homologationsDbg.push({
        type: "KBA",
        code: row.homologation_kba,
        doc: row.homologation_kba_doc || null,
        note: row.note_kba || null,
      });
    }
    if (row.homologation_ece) {
      homologationsDbg.push({
        type: "ECE",
        code: row.homologation_ece,
        doc: row.homologation_ece_doc || null,
        note: row.note_ece || null,
      });
    }
    if (row.homologation_jwl) {
      homologationsDbg.push({
        type: "JWL",
        code: row.homologation_jwl,
        doc: row.homologation_jwl_doc || null,
        note: null,
      });
    }
    if (row.homologation_ita) {
      homologationsDbg.push({
        type: "ITA",
        code: row.homologation_ita,
        doc: row.homologation_ita_doc || null,
        note: row.note_ita || null,
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
        plug_play: !!row.plug_play,
      },
      homologations: homologationsDbg,
      raw: row,
    });
  } catch (err) {
    console.error("[DB] /fitment-debug error:", err);
    res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

app.get("/debug-tables", async (req, res) => {
  const tables = [
    "car_manufacturers",
    "car_models",
    "car_versions",
    "am_wheel_models",
    "am_wheels",
    "applications",
  ];
  const result = {};
  for (const table of tables) {
    const [rows] = await pool.query(`DESCRIBE ${table}`);
    result[table] = rows.map((r) => ({ Field: r.Field, Type: r.Type }));
  }
  res.json(result);
});

app.post("/fitment", async (req, res) => {
  try {
    const { carId, wheelId } = req.body;

    if (!carId || !wheelId) {
      return res.status(400).json({
        ok: false,
        error: "Parametri mancanti. Devi inviare carId e wheelId.",
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
        wheelId,
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
        plugAndPlay: !!row.plug_play,
      },
      homologations,
    });
  } catch (err) {
    console.error("[DB] /fitment error:", err);
    res.status(500).json({
      ok: false,
      error: String(err?.message || err),
    });
  }
});

// Avvio server
app.listen(port, () => {
  console.log(`FondmetalAI API in ascolto su http://localhost:${port}`);
});
