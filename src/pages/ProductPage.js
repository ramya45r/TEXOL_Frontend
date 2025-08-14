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

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    API.get('/products/' + id)
      .then(r => {
        setP(r.data);
        setTitle(r.data.title);
        setPrice(r.data.price);
        setStock(r.data.stock);
        setDescription(r.data.description || '');
      })
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('description', description);
      if (image) formData.append('images', image);

      await API.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert('Product updated successfully');
      setShowUpdateForm(false);

      const updated = await API.get('/products/' + id);
      setP(updated.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating product');
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
          <p className="product-price">Price: ₹{p.price}</p>
          <p className="product-stock">Stock: {p.stock}</p>
          <p className="product-description">{p.description}</p>

          {user?.role === 'admin' ? (
            <>
              <button
                className="btn btn-update"
                onClick={() => setShowUpdateForm(true)}
              >
                Update Product
              </button>
              <button className="btn btn-delete" onClick={handleDelete}>
                Delete Product
              </button>
            </>
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

      {showUpdateForm && user?.role === 'admin' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update Product</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <div className="modal-actions">
                <button type="submit" className="btn btn-save">Save Changes</button>
                <button type="button" className="btn btn-cancel" onClick={() => setShowUpdateForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
