'use client';

import Link from 'next/link';
import { CartLineItem } from '@/features/cart/components/CartLineItem';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/shared/components/ui/button';

export function CartPageContent() {
  const items = useCartStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">Seu carrinho está vazio.</p>
        <Link href="/produtos">
          <Button type="button">Ver produtos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {items.map((item) => (
          <CartLineItem key={item.productId} productId={item.productId} />
        ))}
      </div>
      <CartSummary />
    </div>
  );
}
