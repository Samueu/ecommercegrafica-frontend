import { Suspense } from 'react';
import { LoginForm } from '@/features/auth';

export const metadata = {
  title: 'Entrar',
};

export default function LoginPage() {
  // O LoginForm usa useSearchParams() para ler ?redirect=... e isso
  // exige um Suspense boundary explícito quando há prerender estático.
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
