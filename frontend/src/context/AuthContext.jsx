import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    if (token) {
      // Verify token is still valid
      authService.getProfile()
        .then(res => setUser(res.data.user))
        .catch((err) => {
          console.error('Token verification failed:', err);
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(name, email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isReturningUser', 'false'); // New user
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isReturningUser', response.data.user.isReturningUser ? 'true' : 'false');
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isReturningUser');
    localStorage.removeItem('fitai_chat_history'); // Clear chat history on logout
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
