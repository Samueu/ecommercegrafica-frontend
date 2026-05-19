import { ProductGrid } from '@/features/catalog';
import { Container } from '@/shared/components/layout/Container';
import { PageHeader } from '@/shared/components/layout/PageHeader';

export const metadata = {
  title: 'Produtos',
};

export default function ProductsPage() {
  return (
    <Container>
      <PageHeader
        title="Produtos"
        description="Confira nosso catálogo de impressos e materiais promocionais."
      />
      <ProductGrid />
    </Container>
  );
}
