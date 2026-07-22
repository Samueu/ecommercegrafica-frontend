import type { Product } from '@/entities/product/product.types';
import {
  mapProdutoDtoToProduct,
  type ProdutoDto,
} from '@/entities/product/product.mapper';
import { apiFetch } from '@/shared/api/http-client';
import { endpoints } from '@/shared/api/endpoints';

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  currency?: string;
  typeCode: number;
  imageFiles?: File[];
};

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

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const formData = new FormData();
  formData.append('Nome', input.name);
  formData.append('Descricao', input.description);
  formData.append('Preco', String(input.price));
  formData.append('Tipo', String(input.typeCode));
  if (input.currency) {
    formData.append('Moeda', input.currency);
  }
  for (const file of input.imageFiles ?? []) {
    formData.append('Imagens', file);
  }

  const dto = await apiFetch<ProdutoDto>(endpoints.catalog.products, {
    method: 'POST',
    body: formData,
  });
  return mapProdutoDtoToProduct(dto);
}
