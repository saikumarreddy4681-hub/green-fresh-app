import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('greenfresh_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('greenfresh_token');
      const storedUser = localStorage.getItem('greenfresh_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Refresh profile in background
          const res = await api.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('greenfresh_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Auth token verify note:', err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('greenfresh_token', res.token);
      localStorage.setItem('greenfresh_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('greenfresh_token', res.token);
      localStorage.setItem('greenfresh_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('greenfresh_token');
    localStorage.removeItem('greenfresh_user');
  };

  const updateUser = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('greenfresh_user', JSON.stringify(res.user));
    }
    return res;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

