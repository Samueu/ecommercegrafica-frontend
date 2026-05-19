import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { mockProducts } from '@/features/catalog/mocks/products.mock';
import { mockOrders } from '@/features/orders/mocks/orders.mock';

export const metadata = {
  title: 'Dashboard',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockProducts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockOrders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aguardando pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {mockOrders.filter((o) => o.status === 'awaiting_payment').length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
