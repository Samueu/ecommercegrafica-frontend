'use client';

import Link from 'next/link';
import { CartLineItem } from '@/features/cart/components/CartLineItem';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { formatCurrency } from '@/shared/lib/format';
import { ShoppingCart } from 'lucide-react';

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.getItemCount());
  const subtotal = useCartStore((s) => s.getSubtotal());

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button type="button" variant="outline" size="icon" className="relative" aria-label="Carrinho">
            <ShoppingCart className="size-4" />
            {itemCount > 0 ? (
              <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-xs">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            ) : null}
          </Button>
        }
      />
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Carrinho ({itemCount})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center text-sm">Carrinho vazio</p>
          ) : (
            items.map((item) => (
              <CartLineItem key={item.productId} productId={item.productId} />
            ))
          )}
        </div>
        <SheetFooter className="border-t pt-4">
          <div className="mb-3 flex w-full justify-between font-semibold">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Link href="/carrinho" className="w-full">
            <Button type="button" variant="outline" className="w-full">
              Ver carrinho
            </Button>
          </Link>
          <Link href="/checkout" className="w-full">
            <Button type="button" className="w-full" disabled={items.length === 0}>
              Checkout
            </Button>
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
