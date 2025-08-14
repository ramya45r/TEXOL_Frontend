import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import './Admin.css';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Product form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // NEW
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');

  // Category form state
  const [newCategory, setNewCategory] = useState('');

  const token = localStorage.getItem('token');

  const fetchProducts = () => {
    API.get('/products', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => setProducts(r.data.items))
      .catch(console.error);
  };

  const fetchCategories = () => {
    API.get('/categories')
      .then((r) => setCategories(r.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Create Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description); // NEW
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('category', category);
      if (image) formData.append('images', image);

      await API.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle('');
      setDescription(''); // RESET
      setPrice('');
      setStock('');
      setCategory('');
      setImage(null);
      setShowProductForm(false);

      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating product');
    }
  };

  // Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await API.post(
        '/categories/',
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewCategory('');
      setShowCategoryForm(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating category');
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <p className="product-count">Product count: {products.length}</p>
      <p className="product-count">Category count: {categories.length}</p>

      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button onClick={() => setShowProductForm(!showProductForm)}>
          {showProductForm ? 'Cancel Product' : 'Create Product'}
        </button>
        <button onClick={() => setShowCategoryForm(!showCategoryForm)}>
          {showCategoryForm ? 'Cancel Category' : 'Create Category'}
        </button>
      </div>

      {/* Product Form */}
      {showProductForm && (
        <form onSubmit={handleCreateProduct} className="create-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
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
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
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

      {/* Category Form */}
      {showCategoryForm && (
        <form onSubmit={handleCreateCategory} className="create-form">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
          <button type="submit" className="save-btn">
            Save Category
          </button>
        </form>
      )}

      {/* Products List */}
      <h3>Products</h3>
      <ul className="product-list">
        {products.map((p) => (
          <li key={p._id}>
            <div>
              <strong>{p.title}</strong> - ₹{p.price} - Stock: {p.stock}
              <br />
              <small>{p.description}</small>
            </div>
            <span>{p.category || 'No category'}</span>
          </li>
        ))}
      </ul>

      {/* Categories List */}
      <h3>Categories</h3>
      <ul className="product-list">
        {categories.map((c) => (
          <li key={c._id}>
            <strong>{c.name}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
