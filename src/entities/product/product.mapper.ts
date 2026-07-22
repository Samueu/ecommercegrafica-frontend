import type { Product, ProductImage } from '@/entities/product/product.types';

export type ProdutoImagemDto = {
  id: number;
  url: string;
  ordem: number;
};

export type ProdutoDto = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  moeda: string;
  tipo: number;
  ativo: boolean;
  criadoEm: string;
  imagemUrl?: string | null;
  imagens?: ProdutoImagemDto[] | null;
};

const TYPE_LABELS: Record<number, string> = {
  1: 'Cartão',
  2: 'Banner',
  3: 'Folder',
  4: 'Adesivo',
  5: 'Convite',
};

function mapImagens(dto: ProdutoDto): { images: ProductImage[]; imageUrls: string[] } {
  const sorted = [...(dto.imagens ?? [])].sort((a, b) => a.ordem - b.ordem);
  const images: ProductImage[] = sorted.map((img) => ({
    id: img.id,
    url: img.url,
    order: img.ordem,
  }));

  let imageUrls = images.map((img) => img.url);

  if (imageUrls.length === 0 && dto.imagemUrl) {
    imageUrls = [dto.imagemUrl];
  }

  return { images, imageUrls };
}

export function mapProdutoDtoToProduct(dto: ProdutoDto): Product {
  const { images, imageUrls } = mapImagens(dto);

  return {
    id: String(dto.id),
    name: dto.nome,
    description: dto.descricao,
    price: dto.preco,
    currency: dto.moeda,
    typeCode: dto.tipo,
    typeLabel: TYPE_LABELS[dto.tipo] ?? 'Outros',
    active: dto.ativo,
    imageUrl: imageUrls[0] ?? dto.imagemUrl ?? undefined,
    imageUrls,
    images,
    createdAt: dto.criadoEm,
  };
}
