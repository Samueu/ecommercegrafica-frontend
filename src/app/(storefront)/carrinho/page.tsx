import { CartPageContent } from '@/features/cart';
import { Container } from '@/shared/components/layout/Container';
import { PageHeader } from '@/shared/components/layout/PageHeader';

export const metadata = {
  title: 'Carrinho',
};

export default function CartPage() {
  return (
    <Container>
      <PageHeader title="Carrinho" description="Revise os itens antes de finalizar a compra." />
      <CartPageContent />
    </Container>
  );
}
