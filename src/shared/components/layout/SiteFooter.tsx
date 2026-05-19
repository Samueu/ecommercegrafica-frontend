import { Container } from '@/shared/components/layout/Container';

export function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <Container>
        <p className="text-muted-foreground text-center text-sm">
          © {new Date().getFullYear()} E-commerce Gráfica — projeto demonstrativo (dados mockados).
        </p>
      </Container>
    </footer>
  );
}
