import { ProductDetail } from '@/features/catalog';
import { Container } from '@/shared/components/layout/Container';

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  return { title: `Produto ${id}` };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <Container>
      <ProductDetail productId={id} />
    </Container>
  );
}
