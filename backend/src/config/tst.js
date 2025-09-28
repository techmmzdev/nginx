import pool from "./db.js";

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Conexión exitosa:", res.rows[0]);
  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
  } finally {
    await pool.end(); // Cierra el pool al final.
  }
}

testConnection();
