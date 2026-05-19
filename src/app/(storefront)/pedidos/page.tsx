import { OrderList } from '@/features/orders';
import { Container } from '@/shared/components/layout/Container';
import { PageHeader } from '@/shared/components/layout/PageHeader';

export const metadata = {
  title: 'Meus pedidos',
};

export default function OrdersPage() {
  return (
    <Container>
      <PageHeader title="Meus pedidos" description="Acompanhe o status das suas compras." />
      <OrderList />
    </Container>
  );
}
