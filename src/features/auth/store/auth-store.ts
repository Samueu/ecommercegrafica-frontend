'use client';

import { create } from 'zustand';
import type { AuthRole, AuthUserDto } from '@/features/auth/api/auth.api';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: AuthRole;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (dto: AuthUserDto | null) => void;
  clearUser: () => void;
  markInitialized: () => void;
};

function normalizeRole(role: AuthUserDto['role']): AuthRole {
  return role === 'admin' ? 'admin' : 'customer';
}

function toAuthUser(dto: AuthUserDto): AuthUser {
  return {
    id: dto.id,
    name: dto.nome?.trim() || dto.email,
    email: dto.email,
    role: normalizeRole(dto.role),
  };
}

/**
 * Store de leitura para o estado de autenticação.
 *
 * Não persiste em localStorage e não escreve cookies: a sessão real vive
 * em cookies httpOnly emitidos pelo backend. Este store é apenas um
 * espelho em memória do que /auth/me devolveu, para que componentes
 * pequenos (header, guards) leiam de forma síncrona.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  setUser: (dto) => {
    if (!dto) {
      set({ user: null, isAuthenticated: false, isInitialized: true });
      return;
    }
    set({ user: toAuthUser(dto), isAuthenticated: true, isInitialized: true });
  },
  clearUser: () => set({ user: null, isAuthenticated: false, isInitialized: true }),
  markInitialized: () => set({ isInitialized: true }),
}));
