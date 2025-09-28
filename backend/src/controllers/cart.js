import * as cartService from "../service/cart.js";

export const getCartItems = async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: "Falta sessionId" });
    const items = await cartService.getCartItems(sessionId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { sessionId, productId, quantity } = req.body;
    if (!sessionId || !productId || !quantity)
      return res.status(400).json({ error: "Faltan datos" });
    const item = await cartService.addToCart(sessionId, productId, quantity);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { sessionId, productId } = req.body;
    if (!sessionId || !productId)
      return res.status(400).json({ error: "Faltan datos" });
    await cartService.removeFromCart(sessionId, productId);
    res.json({ message: "Producto eliminado del carrito" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Falta sessionId" });
    await cartService.clearCart(sessionId);
    res.json({ message: "Carrito vaciado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
