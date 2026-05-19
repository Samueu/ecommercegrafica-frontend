export type ProductType = 'print' | 'banner' | 'sticker' | 'other';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: ProductType;
  active: boolean;
  imageUrl?: string;
  createdAt: string;
};
