import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import AuthContext from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './OrdersPage.css'; // <-- import the CSS file

export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const endpoint = user?.role === 'admin' ? '/orders/' : '/orders/my';

    API.get(endpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
        alert('Failed to fetch orders');
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const updateStatus = (orderId, newStatus) => {
    API.put(
      `/orders/${orderId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
      .then(() => {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to update status');
      });
  };

  if (loading) return <div className="container">Loading orders...</div>;

  if (!orders.length) {
    return (
      <div className="container">
        <h2>{user.isAdmin ? 'All Orders' : 'My Orders'}</h2>
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2 className="orders-title">{user.isAdmin ? 'All Orders' : 'My Orders'}</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <p className="order-id">
                <strong>Order ID:</strong> {order._id}
                {user.isAdmin && <span className="order-user">by {order.user?.name || 'Unknown'}</span>}
              </p>

              {user.isAdmin ? (
                <select
                  className="status-select"
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              ) : (
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              )}
            </div>

            <p className="order-price">
              <strong>Total Price:</strong> ₹{order.totalPrice}
            </p>
            <p className="order-date">
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>

            <div>
              <h4>Items:</h4>
              <ul className="items-list">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} — ₹{item.price} × {item.qty}
                    {item.product && (
                      <Link to={`/product/${item.product._id}`} className="item-link">
                        View
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
