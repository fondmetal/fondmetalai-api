import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import pool from "./db.js";

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
Il GPT può rispondere sia in italiano che in inglese, adattandosi alla lingua dell'utente.
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
    console.error("[DB] Health error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});