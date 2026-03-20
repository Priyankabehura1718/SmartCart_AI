import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

// ✅ SINGLE API INSTANCE
export const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ RESPONSE INTERCEPTOR (NO FORCE LOGOUT)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token');

        const res = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh,
        });

        localStorage.setItem('access_token', res.data.access);

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (e) {
        console.log("Token refresh failed");
        // ❌ DO NOT redirect or clear tokens here
      }
    }

    return Promise.reject(error);
  }
);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED fetchMe (NO AUTO LOGOUT)
  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get('/me/');
      setUser(res.data);
    } catch (err) {
      console.log("fetchMe failed", err);

      // ❌ DO NOT logout if token exists
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  // ✅ LOGIN
  const login = async ({ username, password }) => {
    const res = await api.post('/token/', { username, password });

    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);

    await fetchMe();
    return res.data;
  };

  // ✅ LOGOUT (manual only)
  const logout = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  // ✅ REGISTER
  const register = async ({ username, password, email }) => {
    await api.post('/signup/', { username, password, email });
    return await login({ username, password });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAuth: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};