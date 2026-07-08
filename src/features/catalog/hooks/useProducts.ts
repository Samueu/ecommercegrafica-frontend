'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  getProductById,
  getProducts,
  type CreateProductInput,
} from '@/features/catalog/api/catalog.api';

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

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] });
    },
  });
}
