import mysql2, { type Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_USER,
  DB_PORT,
  DB_HOST,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

export const pool: Pool = mysql2.createPool({
  user: DB_USER || "root",
  password: DB_PASSWORD || "",
  host: DB_HOST || "localhost",
  port: Number(DB_PORT) || 3306,
  database: DB_NAME || "pos",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

