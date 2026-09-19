import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, logoutUser as logoutApi, signupUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('proofly_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await getMe();
        setUser(res.data);
        localStorage.setItem('proofly_user', JSON.stringify(res.data));
      } catch (err) {
        setUser(null);
        localStorage.removeItem('proofly_user');
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    setUser(res.data.user);
    localStorage.setItem('proofly_user', JSON.stringify(res.data.user));
    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await signupUser({ name, email, password });
    setUser(res.data.user);
    localStorage.setItem('proofly_user', JSON.stringify(res.data.user));
    return res.data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      setUser(null);
      localStorage.removeItem('proofly_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
