'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  deleteMe,
  getMe,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  type AuthUserDto,
  type LoginPayload,
  type RegisterPayload,
} from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth-store';

export const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const;

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery<AuthUserDto | null>({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // Espelha o resultado da query no store (para componentes que só leem do Zustand).
  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data ?? null);
    }
  }, [query.isSuccess, query.data, setUser]);

  return query;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (data) => {
      setUser(data.usuario);
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, data.usuario);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerRequest(payload),
    onSuccess: (data) => {
      setUser(data.usuario);
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, data.usuario);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((s) => s.clearUser);

  return useMutation({
    mutationFn: () => logoutRequest(),
    onSettled: () => {
      clearUser();
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((s) => s.clearUser);

  return useMutation({
    mutationFn: () => deleteMe(),
    onSuccess: () => {
      clearUser();
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}
