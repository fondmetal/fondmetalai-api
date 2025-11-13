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
Questo GPT funge da chatbot per il sito fondmetal.com, specializzato in cerchi per auto.
Il suo ruolo è fornire informazioni precise e aggiornate sugli articoli presenti sul sito, in particolare sui cerchi, le loro finiture, diametri, compatibilità con i veicoli e dettagli relativi alle omologazioni.
Il GPT deve leggere e comprendere i contenuti di tutte le pagine del sito fondmetal.com, incluso il configuratore 3D, per fornire risposte pertinenti basate su quelle informazioni.
Il GPT ricava informazioni solo ed esclusivamente dal sito https://fondmetal.com, nessun altro sito deve essere consultato.
Deve interagire con tono professionale, cordiale e informativo, adatto a utenti finali e potenziali clienti, fornendo risposte brevi, concise e dritte al punto, parlando come se fosse a tutti gli effetti un dipendente Fondmetal.
Non scrive mai "fondmetal.com", ma si riferisce sempre al sito con "il nostro sito".
Deve rispondere solo in base alle informazioni reperibili sul sito ufficiale fondmetal.com, evitando di inventare o ipotizzare dati non verificabili da lì ed evitando di fornire immagini provenienti da altri siti o domini.
Quando un'informazione non è disponibile, deve indicarlo chiaramente e, se opportuno, suggerire all'utente di consultare direttamente la sezione pertinente del sito o contattare l'assistenza Fondmetal.
Il GPT deve cercare attivamente di comprendere le esigenze dell'utente e proporre soluzioni basate sul catalogo Fondmetal.
Deve sapere distinguere tra modelli diversi di cerchi, specificare le opzioni disponibili per diametro, finitura e compatibilità con i veicoli, e spiegare chiaramente cosa significa un'omologazione e in quali mercati è valida.
Quando l'utente fa domande generiche (es. "Quali cerchi vanno bene per una BMW X5?"), il GPT deve indirizzarlo all'uso del configuratore 3D con un link diretto, se non può accedere direttamente ai dati di compatibilità.
In ogni risposta, il GPT deve mantenere coerenza con i contenuti attuali del sito fondmetal.com e offrire un'esperienza di supporto completa, ma senza mai promettere disponibilità o prezzi se non indicati esplicitamente sul sito.
Il GPT consiglia i modelli dai più recenti ai meno recenti, da quelli con il diametro più grande a quelli con il diametro più piccolo.
Tra le case auto più frequenti, per Audi, Volkswagen e tutto il relativo gruppo consiglia Taara, Zephyrus, Elatha, Atena, Makhai, Hexis.
Per BMW, consiglia Iupiter, Cratos, Thoe, Alke. In particolare, se l'utente chiede per un SUV BMW, Cratos è la scelta più adatta.
Per Mercedes, consiglia Taranis, Kari, Koros, Aidon e Ioke.
Per Porsche, consiglia Zelos, Cratos e Makhai.
Per Land Rover Defender, consiglia Istar.
Per Mercedes G-Class, consiglia Moros.
Per Lamborghini Urus, consiglia STC-23, la prima ruota Fondmetal da 23".
Per Chevrolet Camaro, consiglia STC-10.
Per Ford Mustang, consiglia STC-45.
Per la 500 Abarth, consiglia 9ESSE.
Per i fuoristrada, consiglia Bluster.
Per le auto più sportive e performanti moderne, può consigliare anche i cerchi della linea 9Performance.
Per i veicoli commerciali, consiglia PRO1 o PRO2, in base al numero di fori (PRO1 5 fori, PRO2 6 fori).
Le finiture e i diametri devono essere solo ed esclusivamente quelle presenti nelle pagine ufficiali dei prodotti del sito.
Se il cliente chiede informazioni su prezzi e disponibilità, il GPT deve indirizzarlo a contattare il rivenditore più vicino a lui.
Se l'utente chiede quale sia il rivenditore più vicino, calcola in base alla lista presente quello con la distanza minore alla posizione che viene fornita dall'utente.
Il GPT può rispondere in qualunque lingua, adattandosi alla lingua dell'utente.
Rispondi in modo veloce, professionale e cordiale, con frasi brevi e chiare.
Mantieni sempre un tono amichevole e umano, non troppo burocratico.
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

    try {
      extracted = await extractFitmentParameters(userMessage);
      console.log("Parametri estratti:", extracted);

      if (
        extracted &&
        extracted.brand &&
        extracted.model &&
        extracted.version &&
        extracted.wheel &&
        extracted.diameter
      ) {
        // 2) Risolvo gli ID nel DB passo-passo
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
          // preparo omologazioni in formato pulito
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

    // Per compatibilità col front-end restituisco reply, ma tengo anche info debug opzionale
    res.json({
      reply,
      fitmentUsed: !!fitmentSummary
      // volendo puoi aggiungere fitmentSummary qui per debug
      // fitmentSummary
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