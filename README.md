# FondmetalAI API

Un'API Node.js per integrare FondmetalAI come chatbot nel tuo sito.

## Come usarla su Render.com

1. Vai su https://render.com
2. Clicca su “New +” > “Web Service”
3. Scegli “Deploy an existing project” > “Upload a folder”
4. Carica lo ZIP di questo progetto
5. Imposta:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Node Version: `18`
6. Aggiungi una variabile ambiente:
   - Key: `OPENAI_API_KEY`
   - Value: la tua chiave da https://platform.openai.com/api-keys

L'endpoint `/chat` accetta POST con JSON:

```json
{
  "message": "Quali cerchi consigli per una Audi A3?"
}
```

Risponde con:

```json
{
  "reply": "Consiglio i modelli Taara, Zephyrus..."
}
```
