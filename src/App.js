import React, { useContext, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import OrdersPage from "./pages/OrdersPage";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./contexts/AuthContext";
import "./App.css";

function AppContent() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo">
            <Link to="/">Shop</Link>
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* Links */}
          <div className={`nav-links ${menuOpen ? "active" : ""}`}>
            {!user && (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                {user.role === "admin" ? (
                  <>
                    <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
                    <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
                  </>
                ) : (
                  <>
                    <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
                    <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
                  </>
                )}

                <button
                  className="logout-btn"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
