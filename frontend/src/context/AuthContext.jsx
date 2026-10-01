import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiAuth } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ttes_token'));
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await apiAuth.getMe();
          if (res.user && res.user.is_blocked) {
            alert('Votre compte a été suspendu par l’administration TTES-ICG.');
            logout();
          } else {
            setUser(res.user);
          }
        } catch (err) {
          console.error('Session expirée ou bloquée:', err);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await apiAuth.login({ email, password });
    if (res.user && res.user.is_blocked) {
      throw new Error('Votre compte a été suspendu par l’administration TTES-ICG.');
    }
    localStorage.setItem('ttes_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setAuthModalOpen(false);
    return res;
  };

  const signup = async (userData) => {
    const res = await apiAuth.signup(userData);
    localStorage.setItem('ttes_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setAuthModalOpen(false);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('ttes_token');
    setToken(null);
    setUser(null);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        authModalOpen,
        authMode,
        openAuth,
        closeAuth,
        setAuthMode,
        isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
        isSuperAdmin: user?.role === 'superadmin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein d’un AuthProvider');
  }
  return context;
};
