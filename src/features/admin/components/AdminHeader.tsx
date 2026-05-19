'use client';

import Link from 'next/link';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { Button } from '@/shared/components/ui/button';

export function AdminHeader() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <span className="font-semibold">Painel Admin</span>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">{user?.email}</span>
        <Link href="/">
          <Button type="button" variant="outline" size="sm">
            Loja
          </Button>
        </Link>
        <Button type="button" variant="ghost" size="sm" onClick={logout}>
          Sair
        </Button>
      </div>
    </header>
  );
}
