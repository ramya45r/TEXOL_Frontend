import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import AuthContext from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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
    API.get('/orders/my', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
        alert('Failed to fetch orders');
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div className="container">Loading orders...</div>;

  if (!orders.length) {
    return (
      <div className="container">
        <h2>My Orders</h2>
        <p>No orders found.</p>
      </div>
    );
  }

  // status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f0ad4e'; // orange
      case 'shipped':
        return '#5bc0de'; // blue
      case 'delivered':
        return '#5cb85c'; // green
      case 'cancelled':
        return '#d9534f'; // red
      default:
        return '#777'; // gray
    }
  };

  return (
    <div className="container" style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>My Orders</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '1.5rem',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.8rem'
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>Order ID:</strong> {order._id}
              </p>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  color: 'white',
                  backgroundColor: getStatusColor(order.status),
                  fontSize: '0.9rem',
                  textTransform: 'capitalize'
                }}
              >
                {order.status}
              </span>
            </div>

            <p style={{ margin: '4px 0' }}>
              <strong>Total Price:</strong> ₹{order.totalPrice}
            </p>
            <p style={{ margin: '4px 0', color: '#666' }}>
              <strong>Date:</strong>{' '}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Items:</h4>
              <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                {order.items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.3rem' }}>
                    {item.name} — ₹{item.price} × {item.qty}
                    {item.product && (
                      <Link
                        to={`/product/${item.product._id}`}
                        style={{
                          marginLeft: '10px',
                          fontSize: '0.85rem',
                          color: '#007bff',
                          textDecoration: 'underline'
                        }}
                      >
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
