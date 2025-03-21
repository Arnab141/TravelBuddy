import React, { createContext, useState, useContext, useEffect } from 'react';

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
  const [user, setUser] = useState({});  // ❌ No localStorage for user
  const url = "http://localhost:5000";

  const getUserInformation = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${url}/api/users/me`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user information");
      }

      const userData = await response.json();
      setUser(userData);  
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Fetch user info when token is set
  useEffect(() => {
    if (token) {
      getUserInformation();
    }
  }, [token]); 

  const value = {
    showLoginPopup,
    setShowLoginPopup,
    token,
    setToken,
    url,
    user,
    setUser,
    getUserInformation,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
