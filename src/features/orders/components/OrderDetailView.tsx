'use client';

import { ORDER_STATUS_LABELS } from '@/entities/order/order.types';
import { OrderStatusTimeline } from '@/features/orders/components/OrderStatusTimeline';
import { useOrder } from '@/features/orders/hooks/useOrders';
import { ErrorState } from '@/shared/components/layout/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/shared/lib/format';

type OrderDetailViewProps = {
  orderId: string;
};

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError || !order) {
    return <ErrorState onRetry={() => refetch()} message="Pedido não encontrado." />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Pedido {order.id}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {formatDate(order.createdAt)} · {ORDER_STATUS_LABELS[order.status]}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>{formatCurrency(item.unitPrice * item.quantity, order.currency)}</span>
            </div>
          ))}
          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal, order.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span>{formatCurrency(order.shipping, order.currency)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total, order.currency)}</span>
            </div>
          </div>
          {order.trackingCode ? (
            <p className="text-muted-foreground pt-2 text-sm">
              Rastreio: <span className="font-mono">{order.trackingCode}</span>
            </p>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Andamento</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusTimeline status={order.status} />
        </CardContent>
      </Card>
    </div>
  );
}
