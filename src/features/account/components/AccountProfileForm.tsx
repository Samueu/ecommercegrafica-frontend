'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

type ProfileValues = {
  name: string;
  email: string;
  phone: string;
};

export function AccountProfileForm() {
  const { register, handleSubmit } = useForm<ProfileValues>({
    defaultValues: {
      name: 'Cliente Demo',
      email: 'cliente@demo.com',
      phone: '(11) 99999-0000',
    },
  });

  const onSubmit = () => {
    toast.success('Perfil atualizado (mock)');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register('name')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" {...register('email')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" {...register('phone')} />
      </div>
      <Button type="submit">Salvar</Button>
    </form>
  );
}
