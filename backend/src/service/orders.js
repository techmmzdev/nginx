import { query } from "../config/db.js";

export const getAllOrders = async () => {
  const result = await query(
    "SELECT o.*, p.name AS product_name FROM orders o JOIN products p ON o.product_id = p.id"
  );
  return result.rows;
};

export const getOrderById = async (id) => {
  const result = await query(
    "SELECT o.*, p.name AS product_name FROM orders o JOIN products p ON o.product_id = p.id WHERE o.id = $1",
    [id]
  );
  return result.rows[0];
};

export const createOrder = async (productId, quantity) => {
  const product = await query("SELECT stock FROM products WHERE id = $1", [
    productId,
  ]);
  if (!product.rows[0]) throw new Error("Producto no encontrado");
  if (product.rows[0].stock < quantity) throw new Error("Stock insuficiente");

  await query("UPDATE products SET stock = stock - $1 WHERE id = $2", [
    quantity,
    productId,
  ]);
  const result = await query(
    "INSERT INTO orders (product_id, quantity) VALUES ($1, $2) RETURNING *",
    [productId, quantity]
  );
  return result.rows[0];
};

export const updateOrderStatus = async (id, status) => {
  const result = await query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
};

export const deleteOrder = async (id) => {
  const result = await query("DELETE FROM orders WHERE id = $1 RETURNING *", [
    id,
  ]);
  return result.rows[0];
};
