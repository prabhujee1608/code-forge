import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('codeforge_user') || localStorage.getItem('codecareer_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('codeforge_user');
        localStorage.removeItem('codecareer_user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data);
    return data;
  };

  const registerUser = async (userData) => {
    const data = await authService.register(userData);
    setUser(data);
    return data;
  };

  const logoutUser = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserLocal = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('codeforge_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        updateUserLocal,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
