'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';

export function AdminHeader() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Mesmo se a chamada falhar, o cookie já foi (ou será) limpo no logout
      // e o store local foi resetado pelo hook useLogout.
    }
    toast.success('Sessão encerrada.');
    router.push('/');
    router.refresh();
  };

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
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? 'Saindo…' : 'Sair'}
        </Button>
      </div>
    </header>
  );
}
