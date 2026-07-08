'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { useCreateProduct } from '@/features/catalog/hooks/useProducts';
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
  image: z
    .custom<FileList | undefined>()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_MIME.includes(files[0].type),
      'Formato inválido. Envie JPG, PNG ou WEBP.',
    )
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_IMAGE_BYTES,
      'A imagem deve ter no máximo 5 MB.',
    ),
});

type ProductFormValues = z.input<typeof productFormSchema>;

export function ProductForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      typeCode: '1',
      image: undefined,
    },
  });

  const createProduct = useCreateProduct();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const watchedImage = watch('image');
  const selectedFile = useMemo(() => {
    if (!watchedImage || watchedImage.length === 0) return null;
    return watchedImage[0];
  }, [watchedImage]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const { ref: imageFieldRef, ...imageFieldRest } = register('image');

  const onSubmit = async (values: ProductFormValues) => {
    const parsed = productFormSchema.parse(values);
    const imageFile = parsed.image && parsed.image.length > 0 ? parsed.image[0] : undefined;

    try {
      const created = await createProduct.mutateAsync({
        name: parsed.name,
        description: parsed.description ?? '',
        price: parsed.price,
        typeCode: Number(parsed.typeCode),
        imageFile,
      });
      toast.success(`Produto "${created.name}" cadastrado com sucesso.`);
      reset({
        name: '',
        description: '',
        price: 0,
        typeCode: '1',
        image: undefined,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
        <Label htmlFor="image">Imagem do produto</Label>
        <Input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          {...imageFieldRest}
          ref={(el) => {
            imageFieldRef(el);
            fileInputRef.current = el;
          }}
        />
        <p className="text-xs text-muted-foreground">
          JPG, PNG ou WEBP. Tamanho máximo: 5 MB.
        </p>
        {errors.image && (
          <p className="text-sm text-destructive">{errors.image.message as string}</p>
        )}
        {previewUrl && (
          <div className="mt-2 overflow-hidden rounded-md border border-border">
            <Image
              src={previewUrl}
              alt="Pré-visualização"
              width={320}
              height={240}
              className="h-40 w-auto object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      <Button type="submit" disabled={createProduct.isPending}>
        {createProduct.isPending ? 'Salvando...' : 'Salvar produto'}
      </Button>
    </form>
  );
}
