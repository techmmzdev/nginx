import * as productService from "../service/products.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Multer (Mantenida sin cambios, ya que parece correcta)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Asegúrate de que esta ruta sea correcta con respecto a donde se ejecuta el servidor
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Solo se permiten imágenes JPG o PNG"));
  },
}).single("image");

export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      // MEJORA DE DEPURACIÓN: Log del error de Multer
      console.error("Multer Error (400):", err.message);
      return res.status(400).json({ error: err.message });
    }
    try {
      const { name, price, stock, description } = req.body;

      // MEJORA DE DEPURACIÓN: Log de los datos recibidos
      console.log("Datos recibidos después de Multer:", {
        name,
        price,
        stock,
        file: req.file ? req.file.filename : "none",
      });

      if (!name || !price || !stock) {
        // MEJORA DE DEPURACIÓN: Log de fallo de validación
        console.error(
          "Validation Failed (400): Missing name, price, or stock."
        );
        return res.status(400).json({ error: "Faltan datos requeridos" });
      }

      const image = req.file ? `/uploads/${req.file.filename}` : "";
      const product = await productService.createProduct(
        name,
        price,
        stock,
        image,
        description || ""
      );
      res.status(201).json(product);
    } catch (err) {
      // Log de errores de base de datos
      console.error("Database Error (500):", err.message);
      res.status(500).json({ error: err.message });
    }
  });
};

export const updateProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const { name, price, stock, description } = req.body;
      if (!name || !price || !stock)
        return res.status(400).json({ error: "Faltan datos requeridos" });

      const image = req.file
        ? `/uploads/${req.file.filename}`
        : req.body.image || "";
      const product = await productService.updateProduct(
        req.params.id,
        name,
        price,
        stock,
        image,
        description || ""
      );
      if (!product)
        return res.status(404).json({ error: "Producto no encontrado" });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
