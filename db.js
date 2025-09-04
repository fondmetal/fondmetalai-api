// db.js
import mysql from "mysql2/promise";

const required = ["DB_HOST", "DB_USER", "DB_PASS", "DB_NAME"];
for (const k of required) {
  if (!process.env[k]) {
    console.warn(`[DB] Variabile mancante: ${k}`);
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // charset: "utf8mb4_general_ci", // decommenta se necessario
});

export default pool;