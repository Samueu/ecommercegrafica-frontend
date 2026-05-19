'use client';

import Image from 'next/image';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/shared/components/ui/button';
import { formatCurrency } from '@/shared/lib/format';
import { Minus, Plus, Trash2 } from 'lucide-react';

type CartLineItemProps = {
  productId: string;
};

export function CartLineItem({ productId }: CartLineItemProps) {
  const item = useCartStore((s) => s.items.find((i) => i.productId === productId));
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!item) return null;

  return (
    <div className="flex gap-4 border-b py-4 last:border-0">
      <div className="bg-muted relative size-20 shrink-0 overflow-hidden rounded-md">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-muted-foreground text-sm">
            {formatCurrency(item.price, item.currency)} cada
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              aria-label="Diminuir quantidade"
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              aria-label="Aumentar quantidade"
            >
              <Plus className="size-3" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold">
              {formatCurrency(item.price * item.quantity, item.currency)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => removeItem(item.productId)}
              aria-label="Remover item"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
