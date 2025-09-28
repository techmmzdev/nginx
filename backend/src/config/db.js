import { Pool } from "pg";
import { ENV } from "./env.js";

const pool = new Pool({
  host: ENV.dbHost,
  port: ENV.dbPort,
  user: ENV.dbUser,
  password: ENV.dbPassword,
  database: ENV.dbName,
  serverPort: ENV.dbServerPort,
});

export const initDB = async () => {
  const res = await pool.query("SELECT NOW()");
  console.log("Conectado a la base de datos PostgreSQL ✅", res.rows[0].now);
};

export const closeDB = async () => {
  await pool.end();
  console.log("Conexión a PostgreSQL cerrada ✅");
};

export const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (err) {
    console.error("Error en la query:", err);
    throw err;
  } finally {
    client.release();
  }
};

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("Conexión exitosa a PostgreSQL");
    client.release();
  } catch (err) {
    console.error("Error conectando a PostgreSQL:", err);
    process.exit(1); // Salir si falla la conexión
  }
};

export default pool;
