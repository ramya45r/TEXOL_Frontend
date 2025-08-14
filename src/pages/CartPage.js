import React, { useContext } from 'react';
import CartContext from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import AuthContext from '../contexts/AuthContext';

export default function CartPage(){
  const { items, remove, updateQty } = useContext(CartContext);
  const { user } = React.useContext(AuthContext);
  const nav = useNavigate();
  const checkout = async () => {
    if (!user) return nav('/login');
    const shipping = { street:'', city:'', state:'', zip:'' };
    await API.post('/orders', { items, shippingAddress: shipping }, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }});
    localStorage.removeItem('cart');
    nav('/');
  };
  return (
    <div className="container">
      <h2>Cart</h2>
      {items.length===0 ? <p>No items</p> : (
        <>
          <ul>
            {items.map(i=> <li key={i.product}>{i.name || i.product} - qty: <input type="number" value={i.qty} onChange={e=> updateQty(i.product, Number(e.target.value))} /> <button onClick={()=> remove(i.product)}>Remove</button></li>)}
          </ul>
          <button onClick={checkout}>Place Order</button>
        </>
      )}
    </div>
  );
}
