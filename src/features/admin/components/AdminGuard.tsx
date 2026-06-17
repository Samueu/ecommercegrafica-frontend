'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMe } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading, isFetched } = useMe();

  useEffect(() => {
    if (!isFetched || isLoading) return;
    if (!user) {
      router.replace('/login?redirect=/admin');
      return;
    }
    if (user.role !== 'admin') {
      router.replace('/');
    }
  }, [user, isFetched, isLoading, router]);

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

  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p>Acesso restrito ao painel administrativo.</p>
        <Link href="/">
          <Button type="button">Voltar à loja</Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
