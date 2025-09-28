import { query } from "../config/db.js";

export const getCartItems = async (sessionId) => {
  const result = await query(
    "SELECT ci.*, p.name, p.price, p.image FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.session_id = $1",
    [sessionId]
  );
  return result.rows;
};

export const addToCart = async (sessionId, productId, quantity) => {
  const product = await query("SELECT stock FROM products WHERE id = $1", [
    productId,
  ]);
  if (!product.rows[0]) throw new Error("Producto no encontrado");
  if (product.rows[0].stock < quantity) throw new Error("Stock insuficiente");

  // Verificar si el producto ya está en el carrito
  const existing = await query(
    "SELECT * FROM cart_items WHERE session_id = $1 AND product_id = $2",
    [sessionId, productId]
  );
  if (existing.rows[0]) {
    const newQuantity = existing.rows[0].quantity + quantity;
    if (product.rows[0].stock < newQuantity)
      throw new Error("Stock insuficiente");
    const result = await query(
      "UPDATE cart_items SET quantity = $1 WHERE session_id = $2 AND product_id = $3 RETURNING *",
      [newQuantity, sessionId, productId]
    );
    await query("UPDATE products SET stock = stock - $1 WHERE id = $2", [
      quantity,
      productId,
    ]);
    return result.rows[0];
  } else {
    const result = await query(
      "INSERT INTO cart_items (session_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [sessionId, productId, quantity]
    );
    await query("UPDATE products SET stock = stock - $1 WHERE id = $2", [
      quantity,
      productId,
    ]);
    return result.rows[0];
  }
};

export const removeFromCart = async (sessionId, productId) => {
  const item = await query(
    "SELECT quantity FROM cart_items WHERE session_id = $1 AND product_id = $2",
    [sessionId, productId]
  );
  if (!item.rows[0]) throw new Error("Producto no está en el carrito");
  const quantity = item.rows[0].quantity;
  const result = await query(
    "DELETE FROM cart_items WHERE session_id = $1 AND product_id = $2 RETURNING *",
    [sessionId, productId]
  );
  await query("UPDATE products SET stock = stock + $1 WHERE id = $2", [
    quantity,
    productId,
  ]);
  return result.rows[0];
};

export const clearCart = async (sessionId) => {
  const items = await query(
    "SELECT product_id, quantity FROM cart_items WHERE session_id = $1",
    [sessionId]
  );
  for (const item of items.rows) {
    await query("UPDATE products SET stock = stock + $1 WHERE id = $2", [
      item.quantity,
      item.product_id,
    ]);
  }
  await query("DELETE FROM cart_items WHERE session_id = $1", [sessionId]);
};
