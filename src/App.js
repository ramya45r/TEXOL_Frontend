import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './contexts/AuthContext';

function AppContent() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <nav className="nav">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/">Home</Link>
            {user.role === 'admin' ? (
              <Link to="/admin">Admin</Link>
            ) : (
              <Link to="/cart">Cart</Link>
            )}
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
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
