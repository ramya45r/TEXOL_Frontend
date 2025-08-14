import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    API.get('/products', {
      params: {
        q: q || undefined,
        category: category || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined
      }
    })
      .then(res => setProducts(res.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Fetch categories (assuming API exists)
    API.get('/categories')
      .then(res => setCategories(res.data))
      .catch(console.error);
    
    fetchProducts();
  }, []);

  return (
    <div className="container">
      <h1>Products</h1>

      {/* Filter Controls */}
      <div className="filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button onClick={fetchProducts}>Filter</button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid">
          {products.length ? (
            products.map(p => (
              <div key={p._id} className="card">
                <img
                  src={
                    p.images?.[0]
                      ? (process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000') + p.images[0]
                      : ''
                  }
                  alt={p.title}
                />
                <h3>{p.title}</h3>
                <p>₹{p.price}</p>
                <Link to={'/product/' + p._id}>View</Link>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
