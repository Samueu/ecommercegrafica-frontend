'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/entities/product/product.types';

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  currency: string;
  imageUrl?: string;
  quantity: number;
};

type CartState = {
  items: CartLine[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                currency: product.currency,
                imageUrl: product.imageUrl,
                quantity,
              },
            ],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'ecommerce-cart' },
  ),
);

/**
 * Indica se o componente já montou no client (e portanto o `persist` do Zustand
 * já reidratou o estado a partir do localStorage).
 *
 * Componentes que dependem do conteúdo persistido (badge do carrinho, totais)
 * devem renderizar a versão "vazia" enquanto isto for `false` para evitar o
 * clássico erro de hidratação SSR ≠ client.
 *
 * Usamos o padrão "mounted state" porque ele funciona em qualquer setup do
 * Next.js (RSC + Turbopack) — a API `useCartStore.persist.hasHydrated()` do
 * Zustand pode retornar `undefined` durante o SSR quando não há `localStorage`.
 */
export function useCartHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
