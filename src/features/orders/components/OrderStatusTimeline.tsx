import type { OrderStatus } from '@/entities/order/order.types';
import { ORDER_STATUS_LABELS } from '@/entities/order/order.types';
import { cn } from '@/shared/lib/utils';

const FLOW: OrderStatus[] = [
  'awaiting_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
];

type OrderStatusTimelineProps = {
  status: OrderStatus;
};

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  if (status === 'cancelled') {
    return (
      <p className="text-destructive text-sm font-medium">Pedido cancelado</p>
    );
  }

  const currentIndex = FLOW.indexOf(status);

  return (
    <ol className="space-y-3">
      {FLOW.map((step, index) => {
        const done = index <= currentIndex;
        return (
          <li key={step} className="flex items-center gap-3 text-sm">
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs',
                done
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/30 text-muted-foreground',
              )}
            >
              {index + 1}
            </span>
            <span className={done ? 'font-medium' : 'text-muted-foreground'}>
              {ORDER_STATUS_LABELS[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
