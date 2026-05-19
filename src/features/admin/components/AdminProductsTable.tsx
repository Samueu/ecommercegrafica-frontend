'use client';

import { mockProducts } from '@/features/catalog/mocks/products.mock';
import { Badge } from '@/shared/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { formatCurrency } from '@/shared/lib/format';

export function AdminProductsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockProducts.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="capitalize">{product.type}</TableCell>
            <TableCell>{formatCurrency(product.price, product.currency)}</TableCell>
            <TableCell>
              <Badge variant={product.active ? 'default' : 'secondary'}>
                {product.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
