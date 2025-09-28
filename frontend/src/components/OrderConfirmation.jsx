import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderConfirmation = ({ items, total, orderId, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Opcional: Redirigir después de unos segundos
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000); // 10 segundos
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
        <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Gracias por tu compra!
        </h2>
        <p className="text-gray-600 mb-6">
          Tu pedido ha sido procesado con éxito. Aquí tienes los detalles:
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          {orderId && (
            <p className="text-sm font-medium text-gray-900">
              Número de pedido: <span className="font-semibold">{orderId}</span>
            </p>
          )}
          <div className="mt-2 space-y-2">
            {items.map((item) => (
              <p key={item.id} className="text-sm text-gray-600">
                {item.name} x {item.quantity} - $
                {(item.price * item.quantity).toFixed(2)}
              </p>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold text-gray-900">
            Total: <span className="text-green-600">${total}</span>
          </p>
        </div>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
          >
            Volver al Inicio
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-800 py-3 px-6 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
