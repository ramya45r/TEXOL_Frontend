import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import CartContext from '../contexts/CartContext';
import AuthContext from '../contexts/AuthContext';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const { add } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/products/' + id)
      .then(r => setP(r.data))
      .catch(console.error);
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        alert('Product deleted successfully');
        navigate('/');
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting product');
      }
    }
  };

  if (!p) return <div className="loading">Loading...</div>;

  return (
    <div className="product-container">
      <h2 className="product-title">{p.title}</h2>
      <div className="product-detail-card">
        <img
          className="product-image"
          src={
            (process.env.REACT_APP_API_URL?.replace('/api', '') ||
              'http://localhost:5000') + p.images?.[0]
          }
          alt={p.title}
        />
        <div className="product-info">
          <p className="product-description">{p.description}</p>
          <p className="product-price">Price: ₹{p.price}</p>
          <p className="product-stock">Stock: {p.stock}</p>

          {user?.role === 'admin' ? (
            <button className="btn btn-delete" onClick={handleDelete}>
              Delete Product
            </button>
          ) : (
            <button
              className="btn btn-cart"
              onClick={() => add({ product: p._id, qty: 1 })}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
