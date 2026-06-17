import { apiFetch } from '@/shared/api/http-client';
import { endpoints } from '@/shared/api/endpoints';

export type AuthRole = 'customer' | 'admin';

export type AuthUserDto = {
  id: number;
  email: string;
  role: AuthRole | string;
  clienteId?: number | null;
  nome?: string | null;
  criadoEm: string;
  ultimoLoginEm?: string | null;
  consentimentoEm?: string | null;
};

export type LoginPayload = {
  email: string;
  senha: string;
};

export type RegisterPayload = {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  consentimentoLgpd: boolean;
  consentimentoVersao?: string;
};

export type AuthResponse = {
  usuario: AuthUserDto;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(endpoints.auth.login, {
    method: 'POST',
    body: payload,
  });
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(endpoints.auth.register, {
    method: 'POST',
    body: payload,
  });
}

export async function logout(): Promise<void> {
  await apiFetch<void>(endpoints.auth.logout, { method: 'POST' });
}

export async function refresh(): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(endpoints.auth.refresh, { method: 'POST' });
}

export async function getMe(): Promise<AuthUserDto | null> {
  try {
    return await apiFetch<AuthUserDto>(endpoints.auth.me);
  } catch {
    return null;
  }
}

export async function deleteMe(): Promise<void> {
  await apiFetch<void>(endpoints.auth.me, { method: 'DELETE' });
}
