import mysql from "mysql2/promise";
import { config, getMissingDbConfig } from "./src/config.js";

const missing = getMissingDbConfig();

if (missing.length) {
  throw new Error(
    `Configurazione database incompleta. Variabili mancanti: ${missing.join(", ")}`
  );
}

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: config.db.connectionLimit,
  queueLimit: 0,
  connectTimeout: config.db.connectTimeoutMs,
});

export default pool;
