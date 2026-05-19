'use client';

import Link from 'next/link';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { useProducts } from '@/features/catalog/hooks/useProducts';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function FeaturedProducts() {
  const { data, isLoading } = useProducts();
  const featured = data?.slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Destaques</h2>
          <p className="text-muted-foreground text-sm">Materiais gráficos mais pedidos</p>
        </div>
        <Link href="/produtos">
          <Button type="button" variant="outline">
            Ver todos
          </Button>
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
