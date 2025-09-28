import * as orderService from "../service/orders.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity)
      return res.status(400).json({ error: "Faltan datos" });
    const order = await orderService.createOrder(productId, quantity);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Falta estado" });
    const order = await orderService.updateOrderStatus(req.params.id, status);
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await orderService.deleteOrder(req.params.id);
    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json({ message: "Pedido eliminado con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};