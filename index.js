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

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ error: "Messaggio vuoto." });
    }

    const completion = await openai.createChatCompletion({
      model: "g-67e2a78742b48191bd3173b3abbded97",
      messages: [{ role: "user", content: userMessage }],
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