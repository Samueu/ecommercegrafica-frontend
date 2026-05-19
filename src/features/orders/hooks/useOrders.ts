'use client';

import { useQuery } from '@tanstack/react-query';
import type { Order } from '@/entities/order/order.types';
import { mockOrders } from '@/features/orders/mocks/orders.mock';
import { sleep } from '@/shared/lib/sleep';

async function fetchOrders(): Promise<Order[]> {
  await sleep(250);
  return mockOrders;
}

async function fetchOrderById(id: string): Promise<Order | undefined> {
  await sleep(200);
  return mockOrders.find((o) => o.id === id);
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders', 'list'],
    queryFn: fetchOrders,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', 'detail', id],
    queryFn: () => fetchOrderById(id),
    enabled: Boolean(id),
  });
}
