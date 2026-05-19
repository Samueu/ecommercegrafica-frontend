'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';

type ProductFormValues = {
  name: string;
  description: string;
  price: string;
};

export function ProductForm() {
  const { register, handleSubmit, reset } = useForm<ProductFormValues>({
    defaultValues: { name: '', description: '', price: '' },
  });

  const onSubmit = (values: ProductFormValues) => {
    toast.success(`Produto "${values.name}" salvo (mock)`);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register('name', { required: true })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" {...register('description')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Preço</Label>
        <Input id="price" type="number" step="0.01" {...register('price')} />
      </div>
      <Button type="submit">Salvar produto</Button>
    </form>
  );
}
