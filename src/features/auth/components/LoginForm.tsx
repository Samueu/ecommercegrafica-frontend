'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/schemas/auth.schemas';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    const ok = login(values.email, values.password);
    if (!ok) {
      toast.error('Credenciais inválidas');
      return;
    }
    toast.success('Login realizado (mock)');
    const isAdmin = values.email.includes('admin');
    router.push(isAdmin ? '/admin' : '/');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" placeholder="voce@email.com" {...register('email')} />
        {errors.email ? (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password ? (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Entrar
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        <Link href="/recuperar-senha" className="underline">
          Esqueci minha senha
        </Link>
        {' · '}
        <Link href="/cadastro" className="underline">
          Criar conta
        </Link>
      </p>
      <p className="text-muted-foreground text-center text-xs">
        Demo: use e-mail com &quot;admin&quot; para painel administrativo.
      </p>
    </form>
  );
}
