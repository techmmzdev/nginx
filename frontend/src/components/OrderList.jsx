import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../service/api.js";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Loader2,
  Trash2, // Ícono para eliminar
} from "lucide-react";
import { toast } from "react-toastify";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/orders`);
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toString().includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "completado":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
      case "pendiente":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
      case "cancelado":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const statusConfig = {
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Completado",
      },
      completado: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Completado",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pendiente",
      },
      pendiente: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pendiente",
      },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelado" },
      cancelado: { bg: "bg-red-100", text: "text-red-800", label: "Cancelado" },
    };

    const config = statusConfig[statusLower] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("¿Estás seguro de eliminar este pedido?")) {
      try {
        await axios.delete(`${API_URL}/orders/${orderId}`);
        setOrders(orders.filter((order) => order.id !== orderId));
        setFilteredOrders(
          filteredOrders.filter((order) => order.id !== orderId)
        );
        toast.success("Pedido eliminado con éxito");
      } catch (err) {
        console.error("Error deleting order:", err);
        toast.error("Error al eliminar el pedido");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-3 text-gray-600">Cargando pedidos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por producto o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Mostrando {filteredOrders.length} de {orders.length} pedidos
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay pedidos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "No se encontraron pedidos con los filtros aplicados."
              : "Aún no se han creado pedidos."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(order.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pedido #{order.id}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-gray-900">
                          Producto:
                        </span>
                        <p className="mt-1">{order.product_name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Cantidad:
                        </span>
                        <p className="mt-1">{order.quantity} unidades</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Fecha:
                        </span>
                        <p className="mt-1">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    {order.total && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-lg font-semibold text-gray-900">
                          Total: ${order.total}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  {/* Opcional: Botón para actualizar estado */}
                  <button className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.001 8.001 0 01-15.356-2m15.356 2H15"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
