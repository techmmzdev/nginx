import { useState, useEffect, useContext } from "react";
import axios from "axios";
import API_URL from "../service/api";
import {
  Package,
  Search,
  Filter,
  Star,
  ShoppingCart,
  Eye,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
  Grid3X3,
  List,
} from "lucide-react";
import { CartContext } from "../context/CartContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("name");
  const { addToCart } = useContext(CartContext);

  const imageBaseUrl = API_URL.replace("/api", "");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "low":
          filtered = filtered.filter((product) => product.price < 50);
          break;
        case "medium":
          filtered = filtered.filter(
            (product) => product.price >= 50 && product.price <= 200
          );
          break;
        case "high":
          filtered = filtered.filter((product) => product.price > 200);
          break;
      }
    }

    if (stockFilter !== "all") {
      switch (stockFilter) {
        case "inStock":
          filtered = filtered.filter((product) => product.stock > 0);
          break;
        case "lowStock":
          filtered = filtered.filter(
            (product) => product.stock > 0 && product.stock <= 10
          );
          break;
        case "outOfStock":
          filtered = filtered.filter((product) => product.stock === 0);
          break;
      }
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "stock":
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, priceFilter, stockFilter, sortBy]);

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        badge: (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Sin stock
          </span>
        ),
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      };
    } else if (stock <= 10) {
      return {
        badge: (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Stock bajo
          </span>
        ),
        icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
      };
    } else {
      return {
        badge: (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Disponible
          </span>
        ),
        icon: <Package className="h-4 w-4 text-green-500" />,
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Cargando productos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Ordenar por nombre</option>
              <option value="price">Precio: menor a mayor</option>
              <option value="priceDesc">Precio: mayor a menor</option>
              <option value="stock">Stock disponible</option>
            </select>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los precios</option>
                <option value="low">Menos de $50</option>
                <option value="medium">$50 - $200</option>
                <option value="high">Más de $200</option>
              </select>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todo el stock</option>
                <option value="inStock">En stock</option>
                <option value="lowStock">Stock bajo</option>
                <option value="outOfStock">Sin stock</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Mostrando {filteredProducts.length} de {products.length} productos
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay productos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || priceFilter !== "all" || stockFilter !== "all"
              ? "No se encontraron productos con los filtros aplicados."
              : "Aún no se han creado productos."}
          </p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {product.image ? (
                        <img
                          src={`${imageBaseUrl}${product.image}`}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                        <button className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => addToCart(product.id, 1)}
                          className="p-2 bg-white rounded-full text-gray-700 hover:text-green-600 transition-colors"
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-white rounded-full text-gray-700 hover:text-yellow-600 transition-colors">
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute top-3 right-3">
                        {stockStatus.badge}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.price}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          {stockStatus.icon}
                          <span className="ml-1">
                            {product.stock} disponibles
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 text-yellow-400 fill-current"
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-500">
                          (4.5)
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => addToCart(product.id, 1)}
                          disabled={product.stock === 0}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          {product.stock === 0
                            ? "Sin stock"
                            : "Agregar al carrito"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div
                    key={product.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          {product.image ? (
                            <img
                              src={`${imageBaseUrl}${product.image}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {product.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                {stockStatus.icon}
                                <span className="ml-1">
                                  {product.stock} en stock
                                </span>
                              </div>
                              <div>{stockStatus.badge}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 mb-2">
                              ${product.price}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                <Eye className="h-3 w-3" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-yellow-600 transition-colors">
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={() => addToCart(product.id, 1)}
                            disabled={product.stock === 0}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            {product.stock === 0
                              ? "Sin stock"
                              : "Agregar al carrito"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
