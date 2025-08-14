import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import './Admin.css'; // Import the CSS file

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);

  // Get token from localStorage
  const token = localStorage.getItem('token');

  const fetchProducts = () => {
    API.get('/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => setProducts(r.data.items))
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('stock', stock);
      if (image) formData.append('images', image);

      await API.post('/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle('');
      setPrice('');
      setStock('');
      setImage(null);
      setShowForm(false);

      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating product');
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <p className="product-count">Product count: {products.length}</p>

      <button
        className="toggle-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : 'Create Product'}
      </button>

      {showForm && (
        <form onSubmit={handleCreate} className="create-form">
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button type="submit" className="save-btn">
            Save Product
          </button>
        </form>
      )}

      <ul className="product-list">
        {products.map((p) => (
          <li key={p._id}>
            <strong>{p.title}</strong> - ₹{p.price} - Stock: {p.stock}
          </li>
        ))}
      </ul>

      <p className="note">
        Use API or Postman to create/edit products (multipart/form-data) - admin protected routes.
      </p>
    </div>
  );
}
