import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { googleLogin as apiGoogleLogin, apiLogin } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  signup: (email: string, password: string, artistName: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
          const authData = JSON.parse(savedAuth);
          setUser(authData.user);
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Dev bypass
      if (import.meta.env.DEV && email === 'admin@foxypromote.com' && password === 'admin123XXX!') {
        const mockUser: User = {
          id: 'dev-admin',
          email,
          artistName: 'Admin (Dev Mode)',
          createdAt: new Date().toISOString(),
          onboardingCompleted: true
        };
        setUser(mockUser);
        const devToken = import.meta.env.VITE_DEV_TOKEN || 'dev-bypass-token';
        localStorage.setItem('auth', JSON.stringify({ user: mockUser, token: devToken }));
        return true;
      }

      const authData = await apiLogin(email, password);
      
      const userData: User = {
        id: authData.user?.id || 'user-' + Date.now(),
        email: authData.user?.email || email,
        artistName: authData.user?.artistName || authData.user?.fullName || authData.user?.givenName || email.split('@')[0],
        profilePicture: authData.user?.pictureUrl || undefined,
        createdAt: authData.user?.insertDate || new Date().toISOString(),
        onboardingCompleted: authData.user?.onboardingCompleted ?? true
      };
      
      setUser(userData);
      localStorage.setItem('auth', JSON.stringify({ user: userData, token: authData.token }));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const authData = await apiGoogleLogin(credential);

      const userData: User = {
        id: authData.user?.id || 'user-' + Date.now(),
        email: authData.user?.email || 'user@foxypromote.com',
        artistName: authData.user?.fullName || authData.user?.givenName || 'User',
        profilePicture: authData.user?.pictureUrl || undefined,
        createdAt: authData.user?.insertDate || new Date().toISOString(),
        onboardingCompleted: authData.user?.onboardingCompleted ?? true
      };
      
      setUser(userData);
      localStorage.setItem('auth', JSON.stringify({ user: userData, token: authData.token }));
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, artistName: string) => {
    setIsLoading(true);
    try {
      // For now, simple signup is still mock or can be integrated later
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'user' + Date.now(),
        email,
        artistName,
        createdAt: new Date().toISOString(),
        onboardingCompleted: false
      };
      
      setUser(mockUser);
      localStorage.setItem('auth', JSON.stringify({ user: mockUser, token: 'mock-token' }));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem('auth');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    loginWithGoogle,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};