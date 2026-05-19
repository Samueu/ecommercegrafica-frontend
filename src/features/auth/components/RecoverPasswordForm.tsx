'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  recoverPasswordSchema,
  type RecoverPasswordFormValues,
} from '@/features/auth/schemas/auth.schemas';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export function RecoverPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoverPasswordFormValues>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = () => {
    toast.success('Link de recuperação enviado (mock)');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email ? <p className="text-destructive text-sm">{errors.email.message}</p> : null}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Enviar link
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        <Link href="/login" className="underline">
          Voltar ao login
        </Link>
      </p>
    </form>
  );
}
