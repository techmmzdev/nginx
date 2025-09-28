import { query } from "../config/db.js";

export const getAllProducts = async () => {
  const result = await query("SELECT * FROM products");
  return result.rows;
};

export const getProductById = async (id) => {
  const result = await query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0];
};

export const createProduct = async (name, price, stock, image, description) => {
  const result = await query(
    "INSERT INTO products (name, price, stock, image, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, price, stock, image, description]
  );
  return result.rows[0];
};

export const updateProduct = async (
  id,
  name,
  price,
  stock,
  image,
  description
) => {
  const result = await query(
    "UPDATE products SET name = $1, price = $2, stock = $3, image = $4, description = $5 WHERE id = $6 RETURNING *",
    [name, price, stock, image, description, id]
  );
  return result.rows[0];
};

export const deleteProduct = async (id) => {
  const result = await query("DELETE FROM products WHERE id = $1 RETURNING *", [
    id,
  ]);
  return result.rows[0];
};
