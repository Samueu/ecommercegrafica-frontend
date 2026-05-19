import Link from 'next/link';
import { FeaturedProducts } from '@/features/catalog';
import { Button } from '@/shared/components/ui/button';
import { Container } from '@/shared/components/layout/Container';

export default function HomePage() {
  return (
    <Container className="space-y-12">
      <section className="bg-muted/50 rounded-2xl px-6 py-12 text-center sm:px-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Materiais gráficos com qualidade profissional
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
          Cartões de visita, banners, adesivos e muito mais. Peça online e receba em casa.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/produtos">
            <Button type="button">Ver catálogo</Button>
          </Link>
          <Link href="/cadastro">
            <Button type="button" variant="outline">
              Criar conta
            </Button>
          </Link>
        </div>
      </section>
      <FeaturedProducts />
    </Container>
  );
}
