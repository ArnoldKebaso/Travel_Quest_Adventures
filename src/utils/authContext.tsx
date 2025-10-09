import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  username: string;
  role: 'user' | 'admin';
  email: string;
  fullName: string;
  phone?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<User, 'username' | 'role'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials with profile data
const CREDENTIALS = {
  admin: { 
    username: 'admin', 
    password: 'admin123', 
    role: 'admin' as const,
    email: 'admin@travelquest.com',
    fullName: 'Admin User',
    phone: '+1 (555) 123-4567',
    bio: 'TravelQuest Adventures Administrator'
  },
  user: { 
    username: 'user', 
    password: 'user123', 
    role: 'user' as const,
    email: 'user@example.com',
    fullName: 'John Doe',
    phone: '+1 (555) 987-6543',
    bio: 'Travel enthusiast exploring the world!'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    // Check admin credentials
    if (username === CREDENTIALS.admin.username && password === CREDENTIALS.admin.password) {
      setUser({ 
        username: CREDENTIALS.admin.username, 
        role: CREDENTIALS.admin.role,
        email: CREDENTIALS.admin.email,
        fullName: CREDENTIALS.admin.fullName,
        phone: CREDENTIALS.admin.phone,
        bio: CREDENTIALS.admin.bio
      });
      return true;
    }
    // Check user credentials
    if (username === CREDENTIALS.user.username && password === CREDENTIALS.user.password) {
      setUser({ 
        username: CREDENTIALS.user.username, 
        role: CREDENTIALS.user.role,
        email: CREDENTIALS.user.email,
        fullName: CREDENTIALS.user.fullName,
        phone: CREDENTIALS.user.phone,
        bio: CREDENTIALS.user.bio
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<Omit<User, 'username' | 'role'>>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
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
