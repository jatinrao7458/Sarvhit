import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../api/authAPI';
import { setAccessToken } from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state by fetching current user
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Attempt to fetch the current user. If a refresh token cookie exists, 
        // the axios interceptor will handle getting a new access token automatically.
        const response = await authAPI.getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        // Expected if not logged in
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth-expired events from axios interceptor
    const handleAuthExpired = () => {
        setUser(null);
        setIsAuthenticated(false);
        setAccessToken(null);
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Login failed" 
      };
    }
  }, []);

  const signup = useCallback(async (name, email, password, role) => {
    try {
      await authAPI.register({ name, email, password, role });
      // Registration successful, return success so UI can redirect or show message
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Signup failed" 
      };
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setAccessToken(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
        user, 
        isAuthenticated, 
        isLoading, 
        login, 
        signup, 
        logout, 
        updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
