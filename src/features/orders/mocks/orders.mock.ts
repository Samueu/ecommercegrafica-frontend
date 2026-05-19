import type { Order } from '@/entities/order/order.types';

export const mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    status: 'delivered',
    items: [
      { productId: '1', productName: 'Cartão de Visita', quantity: 2, unitPrice: 49.9 },
    ],
    subtotal: 99.8,
    shipping: 15,
    total: 114.8,
    currency: 'BRL',
    createdAt: '2025-02-01T14:30:00Z',
    trackingCode: 'BR123456789BR',
  },
  {
    id: 'ORD-1002',
    status: 'shipped',
    items: [
      { productId: '2', productName: 'Banner 80x120cm', quantity: 1, unitPrice: 189 },
    ],
    subtotal: 189,
    shipping: 35,
    total: 224,
    currency: 'BRL',
    createdAt: '2025-02-10T09:15:00Z',
    trackingCode: 'BR987654321BR',
  },
  {
    id: 'ORD-1003',
    status: 'awaiting_payment',
    items: [
      { productId: '3', productName: 'Adesivo Vinil', quantity: 5, unitPrice: 29.9 },
    ],
    subtotal: 149.5,
    shipping: 12,
    total: 161.5,
    currency: 'BRL',
    createdAt: '2025-02-18T16:00:00Z',
  },
];
