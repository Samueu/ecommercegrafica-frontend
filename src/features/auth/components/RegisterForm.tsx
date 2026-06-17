'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  registerSchema,
  type RegisterFormValues,
} from '@/features/auth/schemas/auth.schemas';
import { useRegister } from '@/features/auth/hooks/useAuth';
import { ApiError } from '@/shared/api/http-client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      consent: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync({
        nome: values.name,
        email: values.email,
        senha: values.password,
        telefone: values.phone?.trim() ? values.phone.trim() : undefined,
        consentimentoLgpd: values.consent,
        consentimentoVersao: 'v1',
      });
      toast.success('Conta criada com sucesso.');
      router.push('/');
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.friendlyMessage : 'Não foi possível concluir o cadastro.';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" autoComplete="name" {...register('name')} />
        {errors.name ? <p className="text-destructive text-sm">{errors.name.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email ? <p className="text-destructive text-sm">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone (opcional)</Label>
        <Input id="phone" type="tel" autoComplete="tel" {...register('phone')} />
        {errors.phone ? <p className="text-destructive text-sm">{errors.phone.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        ) : (
          <p className="text-muted-foreground text-xs">
            Mínimo 8 caracteres com maiúscula, minúscula, número e símbolo.
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword ? (
          <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <label className="flex items-start gap-2 text-sm">
          <input
            id="consent"
            type="checkbox"
            className="mt-1 size-4 accent-primary"
            {...register('consent')}
          />
          <span>
            Li e concordo com o tratamento dos meus dados pessoais conforme a{' '}
            <Link href="/politica-de-privacidade" className="underline">
              Política de Privacidade
            </Link>{' '}
            (LGPD).
          </span>
        </label>
        {errors.consent ? (
          <p className="text-destructive text-sm">{errors.consent.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Cadastrando…' : 'Cadastrar'}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        Já tem conta?{' '}
        <Link href="/login" className="underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
