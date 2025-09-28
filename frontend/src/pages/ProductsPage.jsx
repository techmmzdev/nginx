import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import { useState } from "react";
import { Plus, Package } from "lucide-react";

const ProductsPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleProductCreated = () => {
    setRefresh(!refresh);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderno */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gestiona tu inventario de productos
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulario colapsable */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Crear Nuevo Producto
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <ProductForm onProductCreated={handleProductCreated} />
          </div>
        )}

        {/* Lista de productos */}
        <div className="bg-white rounded-xl shadow-sm border">
          <ProductList key={refresh} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
