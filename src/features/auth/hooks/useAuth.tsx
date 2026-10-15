'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginPayload, RegisterPayload } from '../domain/auth.types';
import { AuthService } from '../services/auth.service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('pokevault_token');
    const savedUser = localStorage.getItem('pokevault_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('pokevault_token');
        localStorage.removeItem('pokevault_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (payload: LoginPayload) => {
    const res = await AuthService.login(payload);
    localStorage.setItem('pokevault_token', res.token);
    localStorage.setItem('pokevault_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    router.push('/catalogo');
  };

  const register = async (payload: RegisterPayload) => {
    const res = await AuthService.register(payload);
    localStorage.setItem('pokevault_token', res.token);
    localStorage.setItem('pokevault_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    router.push('/catalogo');
  };

  const logout = () => {
    localStorage.removeItem('pokevault_token');
    localStorage.removeItem('pokevault_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};