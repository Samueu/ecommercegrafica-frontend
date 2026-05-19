'use client';

import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/entities/product/product.types';
import { mockProducts } from '@/features/catalog/mocks/products.mock';
import { sleep } from '@/shared/lib/sleep';

async function fetchProducts(): Promise<Product[]> {
  await sleep(300);
  return mockProducts.filter((p) => p.active);
}

async function fetchProductById(id: string): Promise<Product | undefined> {
  await sleep(200);
  return mockProducts.find((p) => p.id === id);
}

export function useProducts() {
  return useQuery({
    queryKey: ['catalog', 'list'],
    queryFn: fetchProducts,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['catalog', 'detail', id],
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
  });
}
