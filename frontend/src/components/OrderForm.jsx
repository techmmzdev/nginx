import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../service/api";
import {
  ShoppingCart,
  Package,
  Hash,
  Loader2,
  AlertCircle,
} from "lucide-react";

const OrderForm = ({ onOrderCreated }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ productId: "", quantity: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setErrors({ products: "Error al cargar los productos" });
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (productId) => {
    const product = products.find((p) => p.id === Number(productId));
    setSelectedProduct(product);
    setFormData({ ...formData, productId });
    setErrors({ ...errors, productId: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productId) newErrors.productId = "Selecciona un producto";
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = "La cantidad debe ser mayor a 0";
    }
    if (selectedProduct && formData.quantity > selectedProduct.stock) {
      newErrors.quantity = `Stock insuficiente. Disponible: ${selectedProduct.stock}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/orders`, {
        productId: Number(formData.productId),
        quantity: Number(formData.quantity),
      });

      onOrderCreated();
      setFormData({ productId: "", quantity: "" });
      setSelectedProduct(null);
      setErrors({});
    } catch (err) {
      console.error("Error creating order:", err);
      setErrors({
        submit:
          err.response?.data?.error ||
          "Error al crear el pedido. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    if (selectedProduct && formData.quantity) {
      return (selectedProduct.price * formData.quantity).toFixed(2);
    }
    return "0.00";
  };

  const inputClasses = (fieldName) => `
    mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200
    ${
      errors[fieldName]
        ? "border-red-300 bg-red-50"
        : "border-gray-300 hover:border-gray-400"
    }
  `;

  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Cargando productos...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        </div>
      )}

      {errors.products && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-600 text-sm">{errors.products}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selección de Producto */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Package className="h-4 w-4 mr-2 text-gray-500" />
            Producto
          </label>
          <select
            value={formData.productId}
            onChange={(e) => handleProductChange(e.target.value)}
            className={inputClasses("productId")}
            required
          >
            <option value="">Selecciona un producto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price} (Stock: {product.stock})
              </option>
            ))}
          </select>
          {errors.productId && (
            <p className="mt-1 text-red-500 text-xs">{errors.productId}</p>
          )}
        </div>

        {/* Cantidad */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <Hash className="h-4 w-4 mr-2 text-gray-500" />
            Cantidad
          </label>
          <input
            type="number"
            min="1"
            max={selectedProduct?.stock || 999}
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className={inputClasses("quantity")}
            placeholder="1"
            required
          />
          {errors.quantity && (
            <p className="mt-1 text-red-500 text-xs">{errors.quantity}</p>
          )}
          {selectedProduct && (
            <p className="mt-1 text-xs text-gray-500">
              Stock disponible: {selectedProduct.stock} unidades
            </p>
          )}
        </div>
      </div>

      {/* Resumen del Producto */}
      {selectedProduct && (
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen del Pedido
          </h3>
          <div className="flex items-start space-x-4">
            {selectedProduct.image && (
              <img
                src={`${API_URL.replace("/api", "")}${selectedProduct.image}`}
                alt={selectedProduct.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">
                {selectedProduct.name}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {selectedProduct.description}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Precio unitario:</span>
                  <span className="ml-2 font-medium">
                    ${selectedProduct.price}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Cantidad:</span>
                  <span className="ml-2 font-medium">
                    {formData.quantity || 0}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    ${calculateTotal()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón de envío */}
      <div className="flex justify-end pt-6 border-t">
        <button
          type="submit"
          disabled={isLoading || !selectedProduct}
          className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Crear Pedido
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
