import React, { createContext, useState, useContext } from 'react';

// Create Context
const AppContext = createContext();

// Custom Hook for easier access to context
export const useAppContext = () => {
  return useContext(AppContext);
};

// Context Provider
export const AppProvider = ({ children }) => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const url = "http://localhost:5000";

  const value = {
    showLoginPopup,
    setShowLoginPopup,
    token,
    setToken,
    url,
    user,
    setUser
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
