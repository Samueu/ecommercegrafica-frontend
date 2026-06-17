'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/schemas/auth.schemas';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { ApiError } from '@/shared/api/http-client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await loginMutation.mutateAsync({
        email: values.email,
        senha: values.password,
      });
      toast.success('Login realizado com sucesso.');
      const redirect = searchParams.get('redirect');
      const destination =
        redirect && redirect.startsWith('/')
          ? redirect
          : result.usuario.role === 'admin'
            ? '/admin'
            : '/';
      router.push(destination);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.friendlyMessage : 'Não foi possível autenticar.';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          {...register('email')}
        />
        {errors.email ? (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Entrando…' : 'Entrar'}
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
    </form>
  );
}
