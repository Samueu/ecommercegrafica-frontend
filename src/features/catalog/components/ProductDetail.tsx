'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useProduct } from '@/features/catalog/hooks/useProducts';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/shared/components/ui/button';
import { ErrorState } from '@/shared/components/layout/ErrorState';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { formatCurrency } from '@/shared/lib/format';
import { toast } from 'sonner';

type ProductDetailProps = {
  productId: string;
};

export function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter();
  const { data: product, isLoading, isError, refetch } = useProduct(productId);
  const addItem = useCartStore((s) => s.addItem);

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  if (isError || !product) {
    return <ErrorState onRetry={() => refetch()} message="Produto não encontrado." />;
  }

  const handleAdd = () => {
    addItem(product, 1);
    toast.success('Produto adicionado ao carrinho');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="bg-muted relative aspect-square overflow-hidden rounded-xl">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        ) : null}
      </div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-muted-foreground mt-2">{product.description}</p>
        </div>
        <p className="text-2xl font-bold">
          {formatCurrency(product.price, product.currency)}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button type="button" size="lg" onClick={handleAdd}>
            Adicionar ao carrinho
          </Button>
          <Button type="button" size="lg" variant="outline" onClick={() => router.push('/carrinho')}>
            Ver carrinho
          </Button>
        </div>
      </div>
    </div>
  );
}
