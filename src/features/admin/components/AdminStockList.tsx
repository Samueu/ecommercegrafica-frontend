'use client';

import { useProducts } from '@/features/catalog/hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ErrorState } from '@/shared/components/layout/ErrorState';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function AdminStockList() {
  const { data, isLoading, isError, refetch } = useProducts();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((p) => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle className="text-base">{p.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">120</p>
            <p className="text-muted-foreground text-xs">unidades (placeholder)</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
