'use client';

import Link from 'next/link';
import { ORDER_STATUS_LABELS } from '@/entities/order/order.types';
import { useOrders } from '@/features/orders/hooks/useOrders';
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
import { formatCurrency, formatDate } from '@/shared/lib/format';

export function OrderList() {
  const { data, isLoading, isError, refetch } = useOrders();

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
          <TableHead>Pedido</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Link href={`/pedidos/${order.id}`} className="font-medium hover:underline">
                {order.id}
              </Link>
            </TableCell>
            <TableCell>{formatDate(order.createdAt)}</TableCell>
            <TableCell>
              <Badge variant="secondary">{ORDER_STATUS_LABELS[order.status]}</Badge>
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(order.total, order.currency)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
