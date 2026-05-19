'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { Button } from '@/shared/components/ui/button';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role !== 'admin') {
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
