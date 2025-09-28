/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import API_URL from "../service/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [sessionId, setSessionId] = useState(
    localStorage.getItem("cartSessionId") || uuidv4()
  );

  useEffect(() => {
    localStorage.setItem("cartSessionId", sessionId);
    fetchCartItems();
  }, [sessionId]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/cart?sessionId=${sessionId}`
      );
      setCartItems(response.data || []); // Asegura un array vacío si no hay datos
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]); // Fallback a array vacío en caso de error
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      await axios.post(`${API_URL}/cart/add`, {
        sessionId,
        productId,
        quantity,
      });
      await fetchCartItems();
      toast.success("Producto añadido al carrito");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error añadiendo al carrito");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${API_URL}/cart/remove`, {
        data: { sessionId, productId },
      });
      await fetchCartItems();
      toast.success("Producto eliminado del carrito");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error eliminando del carrito");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/cart/clear`, { data: { sessionId } });
      setCartItems([]); // Actualiza inmediatamente
      await fetchCartItems(); // Sincroniza con el backend
      toast.success("Carrito vaciado");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error vaciando el carrito");
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, sessionId }}
    >
      {children}
    </CartContext.Provider>
  );
};
