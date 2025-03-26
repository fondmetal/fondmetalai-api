import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

const fondmetalPrompt = `Sei FondmetalAI, un esperto di cerchi in lega. Usa solo le informazioni presenti sul sito fondmetal.com per consigliare cerchi adatti ai modelli auto richiesti dagli utenti. Interagisci con tono professionale e cordiale. Evita di inventare dati non presenti sul sito. Suggerisci l'uso del configuratore 3D quando necessario.`;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: fondmetalPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("ERRORE OPENAI:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Errore nella generazione della risposta." });
  }
});

app.listen(port, () => {
  console.log(`FondmetalAI API in ascolto su http://localhost:${port}`);
});
