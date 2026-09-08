import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getStoredUser());
  const [token, setToken] = useState(authService.getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getStoredToken();
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.data) {
            setUser((prev) => ({ ...prev, ...res.data }));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err);
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) {
      setUser(res.data);
      setToken(res.data.token);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success) {
      setUser(res.data);
      setToken(res.data.token);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res.success) {
      setUser((prev) => ({ ...prev, ...res.data }));
    }
    return res;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!token && !!user,
    role: user?.role,
    isPatient: user?.role === 'PATIENT',
    isDoctor: user?.role === 'DOCTOR',
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
