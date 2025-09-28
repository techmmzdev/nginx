import OrderList from "../components/OrderList";
import OrderForm from "../components/OrderForm";
import { useState, useEffect } from "react";
import { Package, Plus, ShoppingCart, TrendingUp } from "lucide-react";
import axios from "axios";
import API_URL from "../service/api";

const OrdersPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders`);
        const orders = response.data;
        setStats({
          total: orders.length,
          completed: orders.filter((order) => order.status === "completed")
            .length,
          pending: orders.filter((order) => order.status === "pending").length,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, [refresh]);

  const handleOrderCreated = () => {
    setRefresh(!refresh);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Administra todos los pedidos de clientes
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Pedido
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Pedidos
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Crear Nuevo Pedido
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <OrderForm onOrderCreated={handleOrderCreated} />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border">
          <OrderList key={refresh} />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
