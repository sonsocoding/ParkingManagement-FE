import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/index';
import { setAuthToken } from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        // Cookie-based auth: browser automatically sends httpOnly cookie
        // Bearer token in localStorage is optional fallback
        const token = localStorage.getItem('token');
        if (token) {
          setAuthToken(token);
        }

        const res = await authService.getMe();
        if (res.data) {
          // Backend returns { status: "success", data: { user: {...} } }
          setUser(res.data.user || res.data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        // Not authenticated
        setIsAuthenticated(false);
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      // Backend returns data containing user info (and possibly sets httpOnly cookie)
      if (res.data && res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        // Set token if provided in response
        if (res.data.token) {
          setAuthToken(res.data.token);
          localStorage.setItem('token', res.data.token);
        }
        return { success: true };
      } else if (res.data && res.data.id) { // Some BE structures return user directly
        setUser(res.data);
        setIsAuthenticated(true);
        // Set token if provided in response
        if (res.data.token) {
          setAuthToken(res.data.token);
          localStorage.setItem('token', res.data.token);
        }
        return { success: true };
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem('token');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
