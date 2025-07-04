import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services';

interface AuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  refreshAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAuthStatus = () => {
    setIsAdmin(api.isAuthenticated());
  };

  useEffect(() => {
    refreshAuthStatus();
    setLoading(false);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        refreshAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (username: string, password: string) => {
    await api.login({ username, password });
    setIsAdmin(true);
  };

  const logout = () => {
    api.logout();
    setIsAdmin(false);
  };

  const value = {
    isAdmin,
    login,
    logout,
    loading,
    refreshAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 