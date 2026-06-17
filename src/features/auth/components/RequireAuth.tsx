'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMe } from '@/features/auth/hooks/useAuth';

/**
 * Wrapper client-side que exige um usuário autenticado para renderizar `children`.
 * Usado em páginas protegidas (/checkout, /pedidos, /conta).
 *
 * Em produção, com cookies cross-site, o middleware do Next.js não consegue
 * enxergar o cookie httpOnly da API (ele pertence a outro domínio). Este guard
 * é a única proteção visível ao usuário; a segurança real continua sendo a API
 * recusando chamadas sem o cookie de sessão.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, isFetched } = useMe();

  useEffect(() => {
    if (!isFetched || isLoading) return;
    if (!user) {
      const params = new URLSearchParams({ redirect: pathname ?? '/' });
      router.replace(`/login?${params.toString()}`);
    }
  }, [user, isFetched, isLoading, pathname, router]);

  if (isLoading || !isFetched) {
    return (
      <div className="text-muted-foreground flex items-center justify-center py-16 text-sm">
        Carregando…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
