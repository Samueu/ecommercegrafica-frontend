'use client';

import { useProducts } from '@/features/catalog/hooks/useProducts';
import { Badge } from '@/shared/components/ui/badge';
import { ErrorState } from '@/shared/components/layout/ErrorState';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { formatCurrency } from '@/shared/lib/format';

export function AdminProductsTable() {
  const { data, isLoading, isError, refetch } = useProducts();

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.typeLabel}</TableCell>
            <TableCell>{formatCurrency(product.price, product.currency)}</TableCell>
            <TableCell>
              <Badge variant={product.active ? 'default' : 'secondary'}>
                {product.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
