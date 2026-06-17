import { RequireAuth } from '@/features/auth';
import { OrderDetailView } from '@/features/orders';
import { Container } from '@/shared/components/layout/Container';

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: OrderPageProps) {
  const { id } = await params;
  return { title: `Pedido ${id}` };
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = await params;

  return (
    <Container>
      <RequireAuth>
        <OrderDetailView orderId={id} />
      </RequireAuth>
    </Container>
  );
}
