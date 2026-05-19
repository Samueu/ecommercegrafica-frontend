import { OrderList } from '@/features/orders';

export const metadata = {
  title: 'Pedidos — Admin',
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pedidos</h1>
      <OrderList />
    </div>
  );
}
