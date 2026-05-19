import { AdminProductsTable, ProductForm } from '@/features/admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

export const metadata = {
  title: 'Produtos — Admin',
};

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Produtos</h1>
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Listagem</TabsTrigger>
          <TabsTrigger value="new">Novo produto</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <AdminProductsTable />
        </TabsContent>
        <TabsContent value="new" className="mt-4">
          <ProductForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
