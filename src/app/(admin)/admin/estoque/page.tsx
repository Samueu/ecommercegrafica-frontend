import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { mockProducts } from '@/features/catalog/mocks/products.mock';

export const metadata = {
  title: 'Estoque — Admin',
};

export default function AdminStockPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Estoque</h1>
      <p className="text-muted-foreground text-sm">
        Placeholder — controle de inventário será integrado na fase de API.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProducts.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="text-base">{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">120</p>
              <p className="text-muted-foreground text-xs">unidades (mock)</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
