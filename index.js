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

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const userId = req.body.userId || "default";

    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ error: "Messaggio vuoto." });
    }

    // Recupera o inizializza la cronologia
    const history = chatHistory.get(userId) || [];
    const messages = [
      { role: "system", content: fondmetalPrompt },
      ...history,
      { role: "user", content: userMessage }
    ];

    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages,
      temperature: 0.7
    });

    const reply = completion.data.choices[0].message.content;

    // Aggiorna cronologia (massimo 10 scambi)
    const updatedHistory = [...history, { role: "user", content: userMessage }, { role: "assistant", content: reply }].slice(-10);
    chatHistory.set(userId, updatedHistory);

    res.json({ reply });
  } catch (error) {
    console.error("ERRORE OPENAI:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Errore nella generazione della risposta." });
  }
});

app.listen(port, () => {
  console.log(`FondmetalAI API in ascolto su http://localhost:${port}`);
});

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