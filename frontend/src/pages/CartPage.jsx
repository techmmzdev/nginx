/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import API_URL from "../service/api";
import Checkout from "../components/Checkout"; // Ajusta la ruta según tu estructura
import OrderConfirmation from "../components/OrderConfirmation"; // Ajusta la ruta

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, sessionId } =
    useContext(CartContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedItems, setConfirmedItems] = useState([]);
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const imageBaseUrl = API_URL.replace("/api", "");

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setShowCheckout(true);
    }
  };

  const handleOrderConfirmed = (items, total, id) => {
    setConfirmedItems(items);
    setConfirmedTotal(total);
    setOrderId(id);
    setIsConfirmed(true);
  };

  if (cartItems.length === 0 && !showCheckout && !isConfirmed) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Carrito vacío
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Agrega productos desde la página de productos.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Carrito</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Revisa tus productos seleccionados
                </p>
              </div>
            </div>
            {!showCheckout && !isConfirmed && (
              <button
                onClick={handleCheckout}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                Proceder al Checkout
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showCheckout && !isConfirmed ? (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="grid gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b py-4"
                >
                  <div className="flex items-center space-x-4">
                    {item.image && (
                      <img
                        src={`${imageBaseUrl}${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">Cantidad: {item.quantity}</p>
                      <p className="text-gray-600">
                        Precio: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-xl font-semibold">
                Total: $
                {cartItems.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )}
              </p>
              <button
                onClick={clearCart}
                className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        ) : isConfirmed ? (
          <OrderConfirmation
            items={confirmedItems}
            total={confirmedTotal}
            orderId={orderId}
            onClose={() => {
              setIsConfirmed(false);
              setShowCheckout(false);
            }}
          />
        ) : (
          <Checkout
            onClose={() => setShowCheckout(false)}
            onOrderConfirmed={(items, total, id) =>
              handleOrderConfirmed(items, total, id)
            }
          />
        )}
      </div>
    </div>
  );
};

export default CartPage;
