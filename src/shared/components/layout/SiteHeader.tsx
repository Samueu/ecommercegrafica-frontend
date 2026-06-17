'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { CartDrawer } from '@/features/cart';
import { Button } from '@/shared/components/ui/button';
import { Container } from '@/shared/components/layout/Container';
import { Printer } from 'lucide-react';

export function SiteHeader() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Sessão encerrada.');
    } catch {
      toast.success('Sessão encerrada localmente.');
    } finally {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <header className="border-b">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Printer className="size-5" />
          Gráfica Online
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/produtos" className="hover:underline">
            Produtos
          </Link>
          <Link href="/pedidos" className="hover:underline">
            Meus pedidos
          </Link>
          <Link href="/conta" className="hover:underline">
            Minha conta
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <CartDrawer />
          {user ? (
            <>
              <span className="text-muted-foreground hidden text-sm sm:inline">
                Olá, {user.name.split(' ')[0]}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? 'Saindo…' : 'Sair'}
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button type="button" variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
