'use client';

import Link from 'next/link';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatCurrency } from '@/shared/lib/format';

export function CartSummary() {
  const subtotal = useCartStore((s) => s.getSubtotal());
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Itens ({itemCount})</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between border-t pt-2 font-semibold">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Link href="/checkout" className="w-full">
          <Button type="button" className="w-full" disabled={itemCount === 0}>
            Finalizar compra
          </Button>
        </Link>
        <Link href="/produtos" className="w-full">
          <Button type="button" variant="outline" className="w-full">
            Continuar comprando
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
