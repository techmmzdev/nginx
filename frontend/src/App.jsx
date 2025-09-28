import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <Router>
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">
              Productos
            </Link>
          </li>
          <li>
            <Link to="/orders" className="hover:underline">
              Pedidos
            </Link>
          </li>
          <li>
            <Link to="/cart" className="hover:underline">Carrito</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
