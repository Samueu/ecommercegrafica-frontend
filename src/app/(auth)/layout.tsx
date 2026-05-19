import { Container } from '@/shared/components/layout/Container';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center py-12">
      <Container className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold">Gráfica Online</h1>
          <p className="text-muted-foreground text-sm">Acesse sua conta</p>
        </div>
        <div className="bg-card rounded-xl border p-6 shadow-sm">{children}</div>
      </Container>
    </div>
  );
}
