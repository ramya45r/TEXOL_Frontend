import React, { createContext, useState } from 'react';
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  });
  const save = (next) => { setItems(next); localStorage.setItem('cart', JSON.stringify(next)); };
  const add = (product) => {
    const found = items.find(i=>i.product===product.product);
    let next;
    if (found) next = items.map(i=> i.product===product.product? {...i, qty: i.qty + product.qty}: i);
    else next = [...items, product];
    save(next);
  };
  const remove = (productId) => save(items.filter(i=>i.product!==productId));
  const updateQty = (productId, qty) => save(items.map(i=> i.product===productId? {...i, qty}: i));
   const clear = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };
  return <CartContext.Provider value={{ items, add, remove, updateQty,clear }}>{children}</CartContext.Provider>;
};

export default CartContext;
