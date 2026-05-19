'use client';

import { ProductCard } from '@/features/catalog/components/ProductCard';
import { useProducts } from '@/features/catalog/hooks/useProducts';
import { ErrorState } from '@/shared/components/layout/ErrorState';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function ProductGrid() {
  const { data, isLoading, isError, refetch } = useProducts();

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center">Nenhum produto encontrado.</p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
