import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

export default function Home(){
  const [products, setProducts] = useState([]);
  useEffect(()=>{ API.get('/products').then(res=> setProducts(res.data.items)).catch(console.error); }, []);
  return (
    <div className="container">
      <h1>Products</h1>
      <div className="grid">
        {products.map(p=>(
          <div key={p._id} className="card">
            <img src={p.images?.[0] ? (process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000') + p.images[0] : ''} alt={p.title} />
            <h3>{p.title}</h3>
            <p>₹{p.price}</p>
            <Link to={'/product/'+p._id}>View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
