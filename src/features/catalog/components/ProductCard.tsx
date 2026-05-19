'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/entities/product/product.types';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { formatCurrency } from '@/shared/lib/format';
import { toast } from 'sonner';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem(product, 1);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Link href={`/produtos/${product.id}`} className="block">
        <div className="bg-muted relative aspect-[4/3] w-full">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : null}
        </div>
      </Link>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-base">
          <Link href={`/produtos/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-lg font-semibold">{formatCurrency(product.price, product.currency)}</p>
      </CardContent>
      <CardFooter>
        <Button type="button" className="w-full" onClick={handleAdd}>
          Adicionar ao carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}
