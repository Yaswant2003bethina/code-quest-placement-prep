
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Demo login logic - replace with actual API call
      if (email === 'admin@placement.com' && password === 'admin123') {
        const adminUser = {
          id: '1',
          email: 'admin@placement.com',
          name: 'Admin User',
          role: 'admin' as const
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        return true;
      } else if (email.includes('@') && password.length >= 6) {
        const studentUser = {
          id: '2',
          email,
          name: 'Student User',
          role: 'student' as const
        };
        setUser(studentUser);
        localStorage.setItem('user', JSON.stringify(studentUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      // Demo registration logic - replace with actual API call
      const newUser = {
        id: Math.random().toString(),
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        role: 'student' as const
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
