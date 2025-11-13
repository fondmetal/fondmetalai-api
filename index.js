import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import pool from "./db.js";
import net from "net";
import https from "https";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

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

USO DEI DATI TECNICI
- Se nei messaggi di sistema trovi dati tecnici strutturati (ad esempio fitment, omologazioni, plug & play, limitazioni, ecc.):
  - Considerali come la fonte principale e affidabile.
  - Non modificarli, non interpretarli "a fantasia".
  - Se non trovi una certa informazione nei dati ricevuti, considera che NON ce l'hai.
- Se non hai dati tecnici strutturati per la combinazione richiesta, puoi dare indicazioni generali ma NON confermare mai in modo assoluto che un cerchio è omologato o perfettamente compatibile.

COMPORTAMENTO PER I CASI D'USO PRINCIPALI

1) L'utente vuole sapere quali cerchi montano sulla sua auto.
   - Prima di rispondere, fai domande mirate per raccogliere i dati minimi:
     - Marca
     - Modello
     - Anno (e se necessario generazione/serie)
     - Eventualmente motorizzazione/uso particolare (es. freni maggiorati, assetto).
   - Se hai dati tecnici strutturati per quell'auto:
     - Spiega quali cerchi risultano compatibili e in che configurazione (es. diametri, canali, ET, eventuali limitazioni).
   - Se NON hai dati strutturati sufficienti:
     - Spiega che per essere precisi servono i dati del nostro configuratore 3D.
     - Invita l'utente a usare il configuratore 3D sul nostro sito, spiegando brevemente cosa gli permetterà di vedere.

2) L'utente vuole sapere quali cerchi gli consigli per la sua auto.
   - Prima raccogli gli stessi dati del punto 1 (marca, modello, anno, uso dell'auto).
   - Se hai dati tecnici strutturati, usa quelli per proporre cerchi effettivamente compatibili.
   - Quando fai una proposta, spiega in modo sintetico:
     - perché quel modello di cerchio è adatto (stile, uso, dimensioni, gamma),
     - in che diametri/finiture è disponibile (solo se queste informazioni sono presenti nei dati o chiaramente sul sito).
   - Non consigliare mai cerchi non presenti nel catalogo Fondmetal.

3) L'utente vuole sapere quali cerchi sono omologati per la sua auto.
   - Raccogli sempre prima i dati di identificazione della vettura (marca, modello, anno, eventualmente versione).
   - Se nei dati tecnici strutturati ci sono informazioni di omologazione (ECE, TUV, KBA, JWL, ITA):
     - Elenca chiaramente i tipi di omologazione disponibili e spiega in quali mercati o condizioni sono valide, se questa informazione è esplicita.
   - Se NON hai dati strutturati sulla omologazione per quella combinazione:
     - Spiega che non puoi confermare l'omologazione senza consultare i dati ufficiali.
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
   - Se la domanda è generica (es. "cos'è l'ET?"), fornisci una spiegazione tecnica semplice e neutra.
   - Se la domanda riguarda uno specifico modello di cerchio e hai dati strutturati, utilizza quei dati per dare una risposta precisa.

GESTIONE DEL DIALOGO
- Quando mancano informazioni importanti per dare una risposta precisa, NON saltare subito al configuratore:
  - fai 1–2 domande mirate per completare il quadro;
  - solo dopo, se ancora non è possibile essere specifici, suggerisci il configuratore o il contatto diretto.
- Non fare mai domande inutili: concentrati su quelli che servono davvero (marca, modello, anno, uso, cerchio, dimensioni).
- Ogni volta che cambi argomento (es. da compatibilità a consigli estetici), chiarisci cosa stai facendo.

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
// ESTRAZIONE PARAMETRI DA TESTO (GPT)
// =========================
async function extractFitmentParameters(message) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `Estrai dal testo solo questi valori, se presenti:
          - marca auto
          - modello auto
          - versione
          - cerchio richiesto
          - diametro

          Devi restituire SOLO un oggetto JSON valido.
          IMPORTANTISSIMO:
          - NIENTE testo prima o dopo
          - NIENTE spiegazioni
          - NIENTE blocchi di codice
          - NIENTE backtick (niente \`\`\`)
          
          Formato esatto:
          {
            "brand": "...",
            "model": "...",
            "version": "...",
            "wheel": "...",
            "diameter": "..."
          }

          Se un valore non è presente, usa null.`
        },
        { role: "user", content: message }
      ]
    });

    let raw = completion.data.choices[0].message.content || "";
    raw = raw.trim();
    console.log("Raw estrazione parametri:", raw);

    let jsonText = raw;

    // Se il modello ha usato ```json ... ``` prendo solo il contenuto interno
    const fencedMatch = raw.match(/```(?:json)?([\s\S]*?)```/i);
    if (fencedMatch && fencedMatch[1]) {
      jsonText = fencedMatch[1].trim();
    }

    // Se c'è altro testo intorno, prendo solo la prima {...}
    const braceMatch = jsonText.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      jsonText = braceMatch[0];
    }

    const parsed = JSON.parse(jsonText);

    // Normalizzo i campi mancanti a null
    return {
      brand: parsed.brand ?? null,
      model: parsed.model ?? null,
      version: parsed.version ?? null,
      wheel: parsed.wheel ?? null,
      diameter: parsed.diameter ?? null
    };
  } catch (err) {
    console.error("Errore estrazione parametri (parse):", err);
    return null;
  }
}

// =========================
// 6 FUNZIONI DB DI SUPPORTO
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

// 3) Trova ID della versione auto (car_versions)
async function findCarVersionId(modelId, versionName) {
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
  const dia = Number(diameter);
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
  return rows.length ? rows[0] : null;
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

    // 1) Provo ad estrarre i parametri dal testo (marca, modello, versione, cerchio, diametro)
    let extracted = null;
    let fitmentRow = null;
    let homologations = [];
    let fitmentSummary = null;
    let askForYear = false; // <-- nuovo flag

    try {
      extracted = await extractFitmentParameters(userMessage);
      console.log("Parametri estratti:", extracted);

      // Se abbiamo già un contesto "auto + cerchio", ma manca la versione,
      // non proviamo il fitment e chiediamo all'utente più info (anno/serie)
      if (
        extracted &&
        extracted.brand &&
        extracted.model &&
        extracted.wheel &&
        extracted.diameter &&
        !extracted.version // versione assente → chiedi info all'utente
      ) {
        askForYear = true;
      }

      // Se invece abbiamo TUTTO (compresa la versione) allora proviamo il fitment
      if (
        extracted &&
        extracted.brand &&
        extracted.model &&
        extracted.version &&
        extracted.wheel &&
        extracted.diameter
      ) {
        const manufacturerId = await findManufacturerId(extracted.brand);
        if (!manufacturerId) throw new Error("Manufacturer non trovato");

        const modelId = await findModelId(manufacturerId, extracted.model);
        if (!modelId) throw new Error("Modello non trovato");

        const carVersionId = await findCarVersionId(modelId, extracted.version);
        if (!carVersionId) throw new Error("Versione auto non trovata");

        const wheelModelId = await findWheelModelId(extracted.wheel);
        if (!wheelModelId) throw new Error("Modello cerchio non trovato");

        // estraggo numero dal diametro (es. "20 pollici" -> 20)
        const diaMatch = String(extracted.diameter).match(/(\d{2})/);
        const diameterNum = diaMatch ? parseInt(diaMatch[1], 10) : null;
        if (!diameterNum) throw new Error("Diametro non valido");

        const wheelVersion = await findWheelVersionId(wheelModelId, diameterNum);
        if (!wheelVersion) throw new Error("Versione cerchio non trovata");

        // 3) Cerco la combinazione in applications
        fitmentRow = await getFitmentData(carVersionId, wheelVersion.am_wheel);

        if (fitmentRow) {
          if (fitmentRow.homologation_tuv) homologations.push({ type: "TUV", code: fitmentRow.homologation_tuv });
          if (fitmentRow.homologation_kba) homologations.push({ type: "KBA", code: fitmentRow.homologation_kba });
          if (fitmentRow.homologation_ece) homologations.push({ type: "ECE", code: fitmentRow.homologation_ece });
          if (fitmentRow.homologation_jwl) homologations.push({ type: "JWL", code: fitmentRow.homologation_jwl });
          if (fitmentRow.homologation_ita) homologations.push({ type: "ITA", code: fitmentRow.homologation_ita });

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
      }
    } catch (fitErr) {
      console.warn("Errore o dati incompleti per fitment:", fitErr.message || fitErr);
      // non blocco la chat: vado avanti senza dati DB
    }

    // 4) Recupero o inizializzo la cronologia
    const history = chatHistory.get(userId) || [];

    const messages = [
      { role: "system", content: fondmetalPrompt }
    ];

    // Se ho dati DB validi, li passo al modello come system message aggiuntivo
    if (fitmentSummary) {
      const omologazioniText = homologations.length
        ? homologations.map(h => `${h.type}${h.code ? ` (${h.code})` : ""}`).join(", ")
        : "nessuna omologazione presente nel database per questa combinazione.";

      messages.push({
        role: "system",
        content:
          "Dati tecnici verificati dal database interno per la richiesta attuale:\n" +
          `- Marca: ${extracted.brand}\n` +
          `- Modello: ${extracted.model}\n` +
          `- Versione: ${extracted.version}\n` +
          `- Cerchio: ${extracted.wheel}\n` +
          `- Diametro: ${extracted.diameter}\n` +
          `- Fitment type: ${fitmentSummary.fitment_type || "n/d"}\n` +
          `- Plug & Play: ${fitmentSummary.plug_play ? "sì" : "no"}\n` +
          `- Limitazioni: ${fitmentSummary.limitation_IT || fitmentSummary.limitation || "nessuna specificata"}\n` +
          `- Omologazioni: ${omologazioniText}\n\n` +
          "Quando rispondi su questa combinazione specifica auto-cerchio devi basarti su questi dati e non inventare nulla. " +
          "Se l'utente parla di un'altra auto o di un altro cerchio per cui non hai dati dal database, spiegalo chiaramente e chiedi maggiori dettagli."
      });
    }

    // Se manca anno/versione ma abbiamo già auto + cerchio → GUIDA l'utente
    if (askForYear && !fitmentSummary) {
      messages.push({
        role: "system",
        content:
          "Per la richiesta attuale l'utente ti ha dato marca, modello e cerchio, " +
          "ma NON ti ha indicato anno o versione della vettura. " +
          "Prima di dare una risposta tecnica o parlare di omologazioni, fai una domanda di chiarimento: " +
          "chiedi in modo chiaro e amichevole l'anno di immatricolazione (o il periodo, es. 'dal 2018 in poi') " +
          "e, se necessario, la motorizzazione o la serie. " +
          "Spiega brevemente che le misure e le omologazioni possono cambiare da una versione all'altra. " +
          "Non inventare mai questi dati: chiedili sempre all'utente. " +
          "In questa risposta concentrati su UNA sola domanda di chiarimento, non dare ancora un verdetto definitivo."
      });
    }

    // aggiungo cronologia e messaggio utente
    messages.push(...history, { role: "user", content: userMessage });

    // 5) Chiamata finale a GPT per la risposta all'utente
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages,
      temperature: 0.7
    });

    const reply = completion.data.choices[0].message.content;

    // Aggiorna cronologia (massimo 10 scambi)
    const updatedHistory = [
      ...history,
      { role: "user", content: userMessage },
      { role: "assistant", content: reply }
    ].slice(-10);
    chatHistory.set(userId, updatedHistory);

    res.json({
      reply,
      fitmentUsed: !!fitmentSummary
    });
  } catch (error) {
    console.error("ERRORE /chat:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Errore nella generazione della risposta." });
  }
});

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
    console.error("[DB] Health error:", err); // <— log completo
    res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

app.get("/tcp-check", async (req, res) => {
  const host = process.env.DB_HOST;
  const port = 3306;
  const startTime = new Date().toISOString();

  // Funzione per recuperare IP pubblico della macchina (Render)
  const getPublicIP = () => {
    return new Promise((resolve, reject) => {
      https.get("https://api.ipify.org?format=json", (resp) => {
        let data = "";
        resp.on("data", chunk => data += chunk);
        resp.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json.ip);
          } catch (e) {
            resolve("Non disponibile");
          }
        });
      }).on("error", (err) => {
        resolve("Errore nel recupero IP: " + err.message);
      });
    });
  };

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
      port,
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
      port,
      publicIP,
      timestamp: startTime
    });
  });

  socket.once("error", (err) => {
    res.status(500).json({
      ok: false,
      error: String(err.message || err),
      host,
      port,
      publicIP,
      timestamp: startTime
    });
  });

  try {
    socket.connect(port, host);
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: String(e.message || e),
      host,
      port,
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

    // Ricostruisco una lista di omologazioni presenti (TUV, KBA, ECE, JWL, ITA)
    const homologations = [];

    if (row.homologation_tuv) {
      homologations.push({
        type: "TUV",
        code: row.homologation_tuv,
        doc: row.homologation_tuv_doc || null,
        note: row.note_tuv || null
      });
    }
    if (row.homologation_kba) {
      homologations.push({
        type: "KBA",
        code: row.homologation_kba,
        doc: row.homologation_kba_doc || null,
        note: row.note_kba || null
      });
    }
    if (row.homologation_ece) {
      homologations.push({
        type: "ECE",
        code: row.homologation_ece,
        doc: row.homologation_ece_doc || null,
        note: row.note_ece || null
      });
    }
    if (row.homologation_jwl) {
      homologations.push({
        type: "JWL",
        code: row.homologation_jwl,
        doc: row.homologation_jwl_doc || null,
        note: null
      });
    }
    if (row.homologation_ita) {
      homologations.push({
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
      homologations,
      raw: row // per debug completo
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

    if (row.homologation_tuv) homologations.push({ type: "TUV", code: row.homologation_tuv });
    if (row.homologation_kba) homologations.push({ type: "KBA", code: row.homologation_kba });
    if (row.homologation_ece) homologations.push({ type: "ECE", code: row.homologation_ece });
    if (row.homologation_jwl) homologations.push({ type: "JWL", code: row.homologation_jwl });
    if (row.homologation_ita) homologations.push({ type: "ITA", code: row.homologation_ita });

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