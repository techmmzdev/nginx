/* eslint-disable no-unused-vars */
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { Loader2, ShoppingBag } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import API_URL from "../service/api";

const Checkout = ({ onClose, onOrderConfirmed }) => {
  const { cartItems, clearCart, sessionId } = useContext(CartContext);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [itemsWithPrice, setItemsWithPrice] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const updatedItems = await Promise.all(
          cartItems.map(async (item) => {
            if (item.price) {
              return { ...item, price: Number(item.price) || 0 };
            }
            const response = await axios.get(
              `${API_URL}/products/${item.product_id}`
            );
            return { ...item, price: Number(response.data.price) || 0 };
          })
        );
        setItemsWithPrice(updatedItems);
        setError(null);
      } catch (err) {
        console.error("Error fetching prices:", err);
        setError("No se pudieron cargar los precios. Intenta de nuevo.");
      }
    };
    fetchPrices();
  }, [cartItems]);

  const calculateTotal = () => {
    return itemsWithPrice
      .reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0)
      .toFixed(2);
  };

  const handleCreateOrder = async () => {
    setIsCreatingOrder(true);
    console.log("Iniciando creación de pedido...");
    try {
      let lastOrderId = null;
      for (const item of cartItems) {
        const response = await axios.post(`${API_URL}/orders`, {
          productId: item.product_id,
          quantity: item.quantity,
        });
        console.log("Pedido creado:", response.data);
        lastOrderId = response.data.id; // Almacena el último ID
      }
      await clearCart();
      console.log("Carrito limpiado, notificando confirmación...");
      if (onOrderConfirmed)
        onOrderConfirmed(itemsWithPrice, calculateTotal(), lastOrderId); // Pasa el orderId
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Error al crear los pedidos. Verifica tu conexión.");
      toast.error(err.response?.data?.error || "Error creando pedidos");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Resumen de Compra
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {itemsWithPrice.length > 0 ? (
            <>
              {itemsWithPrice.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    {item.image && (
                      <img
                        src={`${API_URL.replace("/api", "")}${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${(Number(item.price) || 0).toFixed(2)}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {((Number(item.price) || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between text-lg font-semibold text-gray-900 mb-4">
                  <span>Subtotal</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="text-green-600">${calculateTotal()}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Cargando productos...
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <button
            onClick={handleCreateOrder}
            disabled={isCreatingOrder || itemsWithPrice.length === 0}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingOrder ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              "Confirmar Compra"
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
