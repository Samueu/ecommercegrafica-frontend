'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const AUTH_COOKIE = 'mock-auth=1; path=/; max-age=86400';
const CLEAR_COOKIE = 'mock-auth=; path=/; max-age=0';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password) => {
        if (!email || password.length < 4) return false;
        const isAdmin = email.includes('admin');
        const user: AuthUser = {
          id: 'mock-user-1',
          name: isAdmin ? 'Admin Loja' : 'Cliente Demo',
          email,
          role: isAdmin ? 'admin' : 'customer',
        };
        if (typeof document !== 'undefined') {
          document.cookie = AUTH_COOKIE;
        }
        set({ user, isAuthenticated: true });
        return true;
      },
      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = CLEAR_COOKIE;
        }
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'ecommerce-auth' },
  ),
);
