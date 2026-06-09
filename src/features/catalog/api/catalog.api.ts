import type { Product } from '@/entities/product/product.types';
import {
  mapProdutoDtoToProduct,
  type ProdutoDto,
} from '@/entities/product/product.mapper';
import { apiFetch } from '@/shared/api/http-client';
import { endpoints } from '@/shared/api/endpoints';

export async function getProducts(): Promise<Product[]> {
  const data = await apiFetch<ProdutoDto[]>(endpoints.catalog.products);
  return data.map(mapProdutoDtoToProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const data = await apiFetch<ProdutoDto>(endpoints.catalog.product(id));
    return mapProdutoDtoToProduct(data);
  } catch {
    const list = await getProducts();
    return list.find((p) => p.id === id);
  }
}
