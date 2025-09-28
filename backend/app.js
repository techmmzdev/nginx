import express from "express";
import path from "path";
import cors from "cors";
import { initDB } from "./src/config/db.js";
import { ENV } from "./src/config/env.js";
import productsRoutes from "./src/routes/productsRoutes.js";
import ordersRoutes from "./src/routes/ordersRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/cart", cartRoutes);

// Inicializar DB y servidor
initDB()
  .then(() => {
    app.listen(ENV.port, () => {
      console.log(
        `[HTTP] 🚀 Servidor escuchando en http://localhost:${ENV.port}`
      );
    });
  })
  .catch((error) => {
    console.error("[DB] Error al conectar con la base de datos:", error);
    process.exit(1);
  });
