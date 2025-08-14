import React, { createContext, useState, useEffect } from 'react';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  });
  const setAuth = (data) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  return <AuthContext.Provider value={{ user, setAuth, logout }}>{children}</AuthContext.Provider>;
};
export default AuthContext;
