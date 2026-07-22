export type ProductImage = {
  id: number;
  url: string;
  order: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  typeCode: number;
  typeLabel: string;
  active: boolean;
  /** Primeira imagem (capa) — compatível com listagens e carrinho. */
  imageUrl?: string;
  /** Galeria completa ordenada para carrossel. */
  imageUrls: string[];
  images: ProductImage[];
  createdAt: string;
};

export const MAX_PRODUCT_IMAGES = 8;

export function getProductImageUrls(
  product: Pick<Product, 'imageUrl' | 'imageUrls'>,
): string[] {
  if (product.imageUrls.length > 0) {
    return product.imageUrls;
  }
  return product.imageUrl ? [product.imageUrl] : [];
}
