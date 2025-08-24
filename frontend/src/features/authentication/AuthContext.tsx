import React, { createContext, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import type { User, LoginCredentials, RegisterData } from './types';
import { AuthService } from './services/AuthService';

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure axios sends session cookies to the backend
  axios.defaults.withCredentials = true;

  // Use a simple client-side redirect to avoid adding react-router-dom dependency in the dev environment
  const navigate = (path: string) => window.location.assign(path);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    AuthService.getCurrentUser()
      .then((u) => {
        if (!mounted) return;
        setUser(u || null);
        setIsAuthenticated(!!u);
      })
      .catch(() => {
        // ignore; unauthenticated is fine
      })
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const u = await AuthService.login(credentials);
      // refresh client-side state and navigate to the app root on success
      setUser(u);
      setIsAuthenticated(true);
      try {
        // attempt to fetch a fresh user object (no-op if service returned up-to-date data)
        const fresh = await AuthService.getCurrentUser();
        setUser(fresh);
      } catch (e) {
        // ignore; fallback to u
      }
      navigate('/');
      return u;
    } catch (err: any) {
      const msg = err?.message || 'Login failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const u = await AuthService.register(data);
      setUser(u);
      setIsAuthenticated(true);
      return u;
    } catch (err: any) {
      const msg = err?.message || 'Registration failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
