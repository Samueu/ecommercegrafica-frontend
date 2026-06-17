import { Suspense } from 'react';
import { RequireAuth } from '@/features/auth';
import { CheckoutWizard } from '@/features/checkout';
import { Container } from '@/shared/components/layout/Container';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Skeleton } from '@/shared/components/ui/skeleton';

export const metadata = {
  title: 'Checkout',
};

export default function CheckoutPage() {
  return (
    <Container>
      <PageHeader title="Checkout" description="Finalize seu pedido em poucos passos." />
      <RequireAuth>
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <CheckoutWizard />
        </Suspense>
      </RequireAuth>
    </Container>
  );
}
