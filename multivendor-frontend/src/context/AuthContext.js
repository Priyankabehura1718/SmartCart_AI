// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api'; // change if your Django runs on a different port

// Axios instance shared across the app
export const api = axios.create({ baseURL: BASE_URL });

// Attach JWT access token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh access token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token');
        const res = await api.post('/token/refresh/', { refresh });
        localStorage.setItem('access_token', res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch {
        // Refresh failed — clear storage and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user from /me/
  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get('/me/');
      setUser(res.data);
    } catch {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  }, []);

  // On app load, check if token exists and fetch user
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) fetchMe();
    else setLoading(false);
  }, [fetchMe]);

  // Login — POST to /token/ to get JWT pair
  const login = async ({ username, password }) => {
    const res = await api.post('/token/', { username, password });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    await fetchMe();
    return res.data;
  };

  // Logout — blacklist refresh token on server, clear local storage
  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      await api.post('/logout/', { refresh });
    } catch {}
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  // Register — signup then auto-login
  const register = async ({ username, password, email }) => {
    await api.post('/signup/', { username, password, email });
    return await login({ username, password });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};