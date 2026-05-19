import { SiteFooter } from '@/shared/components/layout/SiteFooter';
import { SiteHeader } from '@/shared/components/layout/SiteHeader';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-8">{children}</main>
      <SiteFooter />
    </>
  );
}
