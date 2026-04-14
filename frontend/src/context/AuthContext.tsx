import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
  phone?: string;
  avatar?: string;
  is_blocked?: boolean;
  addresses?: any[];
}


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { setCart, setWishlist } = useStore();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      hydrateStore();
    }
    setIsLoading(false);
  }, []);

  const hydrateStore = async () => {
    try {
      const [{ data: cart }, { data: wishlist }] = await Promise.all([
        api.get('/store/cart'),
        api.get('/store/wishlist')
      ]);
      setCart(cart);
      setWishlist(wishlist);
    } catch (err) {
      console.error('Failed to hydrate store:', err);
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    await hydrateStore();
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    await hydrateStore();
  };

  const googleLogin = async (credential: string) => {
    const { data } = await api.post('/auth/google', { credential });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    await hydrateStore();
  };

  const updateProfile = async (profileData: Partial<User>) => {
    const { data } = await api.put('/auth/profile', profileData);
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    if (!user) return;
    const { data } = await api.get('/auth/me');
    const updatedUser = { ...user, ...data }; // Preserve token
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCart([]);
    setWishlist([]);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, updateProfile, refreshUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
