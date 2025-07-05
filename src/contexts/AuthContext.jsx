// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, setCurrentUser, removeCurrentUser, getUsers, initializeLocalStorage } from '../utils/localStorage';
import { USERS } from '../utils/constants'; [cite_start]// Import USERS for login validation [cite: 15]

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize localStorage with mock data when the app starts
    initializeLocalStorage();
    setLoading(false);
  }, []);

  const login = (email, password) => {
    [cite_start]// Simulate authentication against hardcoded users [cite: 15, 16]
    const user = getUsers().find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user); [cite_start]// Persist session [cite: 17]
      setCurrentUserState(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    removeCurrentUser();
    setCurrentUserState(null);
  };

  const isAdmin = currentUser?.role === 'Admin'; [cite_start]// Role-based access control [cite: 18]
  const isPatient = currentUser?.role === 'Patient';

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isPatient,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after loading is complete */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};