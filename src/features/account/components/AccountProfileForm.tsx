'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDeleteAccount, useMe } from '@/features/auth/hooks/useAuth';
import { ApiError } from '@/shared/api/http-client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

type ProfileValues = {
  name: string;
  email: string;
};

export function AccountProfileForm() {
  const router = useRouter();
  const { data: user, isLoading } = useMe();
  const deleteAccount = useDeleteAccount();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { register, handleSubmit, reset } = useForm<ProfileValues>({
    defaultValues: { name: '', email: '' },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.nome ?? '', email: user.email });
    }
  }, [user, reset]);

  const onSubmit = () => {
    // TODO: integrar com PUT /api/clientes/me quando o endpoint for criado.
    toast.success('Perfil atualizado (mock — edição de perfil ainda não tem endpoint).');
  };

  const handleDelete = async () => {
    try {
      await deleteAccount.mutateAsync();
      toast.success('Sua conta foi excluída. Esperamos vê-lo novamente.');
      router.push('/');
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.friendlyMessage
          : 'Não foi possível excluir sua conta. Tente novamente em alguns minutos.';
      toast.error(message);
      setConfirmingDelete(false);
    }
  };

  if (isLoading) {
    return (
      <p className="text-muted-foreground text-sm">Carregando seus dados…</p>
    );
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...register('name')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" disabled {...register('email')} />
          <p className="text-muted-foreground text-xs">
            Para trocar seu e-mail, contate o suporte.
          </p>
        </div>
        <Button type="submit">Salvar</Button>
      </form>

      <section className="border-destructive/30 max-w-md space-y-3 rounded-md border p-4">
        <header>
          <h2 className="text-destructive font-semibold">Excluir minha conta</h2>
          <p className="text-muted-foreground text-sm">
            Você pode solicitar a exclusão dos seus dados pessoais a qualquer momento
            (LGPD, art. 18, VI). Os pedidos já realizados podem ser mantidos por exigência
            fiscal, mas seu nome, e-mail e telefone serão removidos/anonimizados.
          </p>
        </header>
        {confirmingDelete ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Tem certeza? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteAccount.isPending}
              >
                {deleteAccount.isPending ? 'Excluindo…' : 'Sim, excluir minha conta'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleteAccount.isPending}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="destructive"
            onClick={() => setConfirmingDelete(true)}
          >
            Quero excluir minha conta
          </Button>
        )}
      </section>
    </div>
  );
}
