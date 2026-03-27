import { createContext, useCallback, useEffect, useState } from 'react';
import type { AuthContextType, User, LoginDto, RegisterDto } from '../types/auth.types';
import { loginApi, registerApi, logoutApi, getMeApi, loginWithGoogleApi, refreshApi } from '../api/auth.api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        // No access token — try a silent refresh first (refresh cookie may still be valid)
        try {
          await refreshApi();
        } catch {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }
      }

      const userData = await getMeApi();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // getMeApi failed (likely expired token) — try refreshing once
      try {
        await refreshApi();
        const userData = await getMeApi();
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        console.error('Auth check failed:', error);
        localStorage.removeItem('access_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (data: LoginDto) => {
    try {
      await loginApi(data);
      const userData = await getMeApi();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(async (token: string) => {
    try {
      await loginWithGoogleApi(token);
      const userData = await getMeApi();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterDto) => {
    try {
      await registerApi(data);
      const userData = await getMeApi();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    }
  }, []);

  // const logout = useCallback(async () => {
  //   try {
  //     await logoutApi();
  //     setUser(null);
  //     setIsAuthenticated(false);
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //     throw error;
  //   }
  // }, []);

  // services/frontend/app/src/context/AuthContext.tsx

  const logout = useCallback(async () => {
    try {
      // We attempt to tell the server we're leaving
      await logoutApi();
    } catch (error) {
      // We log it as a warning, but we don't 'throw' it.
      // This prevents the UI from thinking the logout "failed".
      console.warn('Server-side session cleanup skipped (User likely deleted or session expired).');
    } finally {
      // 🟢 This block runs REGARDLESS of success or failure
      localStorage.removeItem("access_token");
      setUser(null);
      setIsAuthenticated(false);

      /**
       * Pro-tip for 42 School projects: 
       * Using window.location.href = "/login" here is a "Hard Reset".
       * It forcefully kills lingering WebSockets and clears the React 
       * state completely, preventing "Ghost User" messages in the chat.
       */
      window.location.href = "/login";
    }
  }, []);

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, checkAuth, loginWithGoogle, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
