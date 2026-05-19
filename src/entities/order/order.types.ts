export type OrderStatus =
  | 'awaiting_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  createdAt: string;
  trackingCode?: string;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment: 'Aguardando pagamento',
  paid: 'Pago',
  processing: 'Em separação',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};
