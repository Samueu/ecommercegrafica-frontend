'use client';

import { useQuery } from '@tanstack/react-query';
import { getProductById, getProducts } from '@/features/catalog/api/catalog.api';

export function useProducts() {
  return useQuery({
    queryKey: ['catalog', 'list'],
    queryFn: async () => {
      const list = await getProducts();
      return list.filter((p) => p.active);
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['catalog', 'detail', id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
}
