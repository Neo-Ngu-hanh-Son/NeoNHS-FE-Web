/**
 * AuthContext
 * Context để quản lý authentication state toàn cục
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, type LoginCredentials } from '@/services/api/authService';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<any>;
  loginGoogle: (data: { idToken: string }) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    //console.log('checkAuth - token exists:', !!token);

    // If no token, just set loading to false and return
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      //console.log('checkAuth - fetching current user...');
      const currentUser = await authService.getCurrentUser();
      //console.log('checkAuth - currentUser received:', currentUser);
      setUser(currentUser);
      //console.log("Current User", currentUser);
    } catch (err: any) {
      //console.error('checkAuth - error:', err);
      //console.error('checkAuth - error response:', err?.response);
      //console.error('checkAuth - error status:', err?.response?.status);
      // If unauthorized (401), clear the invalid token
      if (err?.response?.status === 401 || err?.message === 'Unauthorized') {
        //console.log('checkAuth - clearing invalid token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      const { accessToken, userInfo } = response.data;
      localStorage.setItem('token', accessToken);
      setUser(userInfo);
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async (data: { idToken: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.loginGoogle(data);
      // API returns: { data: { accessToken, tokenType, userInfo } }
      const { accessToken, userInfo } = response.data;
      localStorage.setItem('token', accessToken);
      setUser(userInfo);
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      //console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    loginGoogle,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
