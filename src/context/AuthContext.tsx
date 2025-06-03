import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
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
        // Mock auth check - would be replaced with actual API call
        const storedUser = localStorage.getItem('tracktraxx_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - would be replaced with actual API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo user - in a real app, this would come from the backend
      const mockUser: User = {
        id: 'user123',
        email,
        artistName: email.split('@')[0],
        createdAt: new Date().toISOString(),
        onboardingCompleted: false
      };
      
      setUser(mockUser);
      localStorage.setItem('tracktraxx_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, artistName: string) => {
    setIsLoading(true);
    try {
      // Mock signup - would be replaced with actual API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo user - in a real app, this would come from the backend
      const mockUser: User = {
        id: 'user' + Date.now(),
        email,
        artistName,
        createdAt: new Date().toISOString(),
        onboardingCompleted: false
      };
      
      setUser(mockUser);
      localStorage.setItem('tracktraxx_user', JSON.stringify(mockUser));
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
      // Mock logout - would be replaced with actual API call
      localStorage.removeItem('tracktraxx_user');
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
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};