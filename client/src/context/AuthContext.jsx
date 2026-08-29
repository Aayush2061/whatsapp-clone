import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessTokenRef = useRef(accessToken);
  accessTokenRef.current = accessToken; // always up to date, synchronously, before any effects run

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await api.post('/auth/refresh');
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  // Register the interceptor ONCE — it reads the live token from the ref,
  // so it never goes stale regardless of render/effect ordering
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (accessTokenRef.current) {
        config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
      }
      return config;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, []);

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};