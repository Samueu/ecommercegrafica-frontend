import { AccountProfileForm } from '@/features/account';
import { RequireAuth } from '@/features/auth';
import { Container } from '@/shared/components/layout/Container';
import { PageHeader } from '@/shared/components/layout/PageHeader';

export const metadata = {
  title: 'Minha conta',
};

export default function AccountPage() {
  return (
    <Container>
      <PageHeader title="Minha conta" description="Atualize seus dados pessoais." />
      <RequireAuth>
        <AccountProfileForm />
      </RequireAuth>
    </Container>
  );
}
