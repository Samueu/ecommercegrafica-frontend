'use client';

import { useEffect } from 'react';
import { useMe } from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '@/features/auth/store/auth-store';

/**
 * Inicializa o estado de autenticação no client.
 *
 * - Chama GET /api/auth/me; se houver cookie válido, popula o store.
 * - Se 401, marca o store como inicializado/sem usuário.
 *
 * Deve ser montado uma única vez dentro do QueryClientProvider.
 */
export function AuthInitializer() {
  const query = useMe();
  const markInitialized = useAuthStore((s) => s.markInitialized);

  useEffect(() => {
    if (query.isError) {
      markInitialized();
    }
  }, [query.isError, markInitialized]);

  return null;
}
