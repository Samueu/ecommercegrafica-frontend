import { AdminStockList } from '@/features/admin';

export const metadata = {
  title: 'Estoque — Admin',
};

export default function AdminStockPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Estoque</h1>
      <p className="text-muted-foreground text-sm">
        Quantidades são placeholders — controle de inventário ainda não exposto pela API.
      </p>
      <AdminStockList />
    </div>
  );
}
