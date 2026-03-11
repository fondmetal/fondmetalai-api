# FondmetalAI API

API Node.js per il chatbot Fondmetal e per gli endpoint di filtro/fitment basati sul database ufficiale.

## Obiettivi della riscrittura

- Compatibilita' e omologazioni decise dal database, non dal modello AI
- Sessione breve lato server senza stato condiviso tra utenti
- CORS ristretto a `fondmetal.com`
- Endpoint amministrativi protetti
- Logging strutturato
- Test minimi con `node:test`

## Stack

- Node.js 20 consigliato su Render
- Express
- MySQL via `mysql2`
- OpenAI usato per analisi del messaggio e wording finale, mai per inventare dati tecnici

## Variabili ambiente

Obbligatorie:

- `DB_HOST`
- `DB_USER`
- `DB_PASS`
- `DB_NAME`
- `ADMIN_TOKEN`

Consigliate:

- `OPENAI_API_KEY`
- `OPENAI_MAIN_MODEL=gpt-4o`
- `OPENAI_ANALYSIS_MODEL=gpt-4o-mini`
- `PORT=3000`
- `ALLOWED_ORIGINS=https://fondmetal.com,https://www.fondmetal.com`
- `FONDMETAL_LINE_ID=22`
- `SESSION_TTL_MS=900000`
- `SESSION_MAX_ENTRIES=1000`
- `RATE_LIMIT_WINDOW_MS=60000`
- `RATE_LIMIT_MAX=60`
- `OPENAI_TIMEOUT_MS=12000`
- `DB_CONNECT_TIMEOUT_MS=10000`
- `DB_CONNECTION_LIMIT=10`
- `TRUST_PROXY=true`
- `LOG_LEVEL=info`

## Endpoint pubblici

- `GET /health`
- `GET /api/health`
- `GET /api/status`
- `POST /chat`
- `POST /fitment`
- `GET /api/marche`
- `GET /api/modelli?marca=...`
- `GET /api/anni?marca=...&modello=...`
- `GET /api/cerchi?marca=...&modello=...&anno=...`

## Endpoint admin protetti

Richiedono header `x-admin-token: <ADMIN_TOKEN>`.

- `GET /health-db`
- `GET /tcp-check`
- `GET /db-tables`
- `GET /db-applications-sample`
- `GET /fitment-debug?car=...&wheel=...`
- `GET /debug-tables`

## Sessione chat

`POST /chat` accetta:

```json
{
  "message": "Quali cerchi consigli per Audi A3 2022?",
  "sessionId": "opzionale"
}
```

Se `sessionId` manca, il backend ne genera uno e lo restituisce nella risposta:

```json
{
  "reply": "...",
  "sessionId": "..."
}
```

Il frontend deve riutilizzare quel `sessionId` per la sessione breve.

## Avvio

```bash
npm start
```

## Test

```bash
npm test
```
