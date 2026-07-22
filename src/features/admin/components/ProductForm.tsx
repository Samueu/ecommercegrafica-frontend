'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { useCreateProduct } from '@/features/catalog/hooks/useProducts';
import { MAX_PRODUCT_IMAGES } from '@/entities/product/product.types';
import { ApiError } from '@/shared/api/http-client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';

const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const PRODUCT_TYPES = [
  { value: '1', label: 'Cartão de Visita' },
  { value: '2', label: 'Banner' },
  { value: '3', label: 'Folder' },
  { value: '4', label: 'Adesivo' },
  { value: '5', label: 'Convite' },
] as const;

const productFormSchema = z.object({
  name: z.string().trim().min(2, 'Informe um nome com pelo menos 2 caracteres.'),
  description: z.string().trim().max(1000, 'Descrição muito longa.').optional().default(''),
  price: z.coerce
    .number({ error: 'Informe um preço válido.' })
    .min(0, 'O preço não pode ser negativo.'),
  typeCode: z
    .string()
    .refine((v) => ['1', '2', '3', '4', '5'].includes(v), 'Selecione um tipo válido.'),
});

type ProductFormValues = z.input<typeof productFormSchema>;

type PreviewItem = {
  id: string;
  file: File;
  url: string;
};

function validateImageFile(file: File): string | null {
  if (!ACCEPTED_MIME.includes(file.type)) {
    return `"${file.name}": formato inválido. Envie JPG, PNG ou WEBP.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `"${file.name}": tamanho máximo de 5 MB.`;
  }
  return null;
}

export function ProductForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      typeCode: '1',
    },
  });

  const createProduct = useCreateProduct();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const previewsRef = useRef(previews);
  previewsRef.current = previews;

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList);
    const slotsLeft = MAX_PRODUCT_IMAGES - previews.length;

    if (slotsLeft <= 0) {
      toast.error(`Máximo de ${MAX_PRODUCT_IMAGES} imagens por produto.`);
      return;
    }

    const toAdd = incoming.slice(0, slotsLeft);
    if (incoming.length > slotsLeft) {
      toast.message(`Somente ${slotsLeft} imagem(ns) adicionada(s) (limite ${MAX_PRODUCT_IMAGES}).`);
    }

    for (const file of toAdd) {
      const error = validateImageFile(file);
      if (error) {
        toast.error(error);
        return;
      }
    }

    setPreviews((current) => [
      ...current,
      ...toAdd.map((file) => ({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
        url: URL.createObjectURL(file),
      })),
    ]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePreview = (id: string) => {
    setPreviews((current) => {
      const item = current.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return current.filter((p) => p.id !== id);
    });
  };

  const onSubmit = async (values: ProductFormValues) => {
    const parsed = productFormSchema.parse(values);

    try {
      const created = await createProduct.mutateAsync({
        name: parsed.name,
        description: parsed.description ?? '',
        price: parsed.price,
        typeCode: Number(parsed.typeCode),
        imageFiles: previews.map((p) => p.file),
      });
      toast.success(`Produto "${created.name}" cadastrado com sucesso.`);
      reset({ name: '', description: '', price: 0, typeCode: '1' });
      setPreviews((current) => {
        current.forEach((p) => URL.revokeObjectURL(p.url));
        return [];
      });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.friendlyMessage : 'Não foi possível cadastrar o produto.';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" rows={4} {...register('description')} />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input id="price" type="number" step="0.01" min="0" {...register('price')} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="typeCode">Tipo</Label>
          <Controller
            control={control}
            name="typeCode"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                <SelectTrigger id="typeCode" className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.typeCode && (
            <p className="text-sm text-destructive">{errors.typeCode.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Imagens do produto</Label>
        <Input
          id="images"
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => handleFilesSelected(e.target.files)}
        />
        <p className="text-xs text-muted-foreground">
          JPG, PNG ou WEBP. Até {MAX_PRODUCT_IMAGES} imagens, 5 MB cada. A primeira será a capa
          do carrossel.
        </p>

        {previews.length > 0 ? (
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {previews.map((preview, index) => (
              <li
                key={preview.id}
                className="relative overflow-hidden rounded-md border border-border"
              >
                <Image
                  src={preview.url}
                  alt={`Pré-visualização ${index + 1}`}
                  width={160}
                  height={120}
                  className="h-28 w-full object-cover"
                  unoptimized
                />
                <span className="bg-background/80 absolute top-1 left-1 rounded px-1.5 text-xs">
                  {index === 0 ? 'Capa' : index + 1}
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute right-1 bottom-1 h-7 px-2 text-xs"
                  onClick={() => removePreview(preview.id)}
                >
                  Remover
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <Button type="submit" disabled={createProduct.isPending}>
        {createProduct.isPending ? 'Salvando...' : 'Salvar produto'}
      </Button>
    </form>
  );
}
