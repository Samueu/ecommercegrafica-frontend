import type { Product } from '@/entities/product/product.types';

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
};

const TYPE_LABELS: Record<number, string> = {
  1: 'Cartão',
  2: 'Banner',
  3: 'Folder',
  4: 'Adesivo',
};

export function mapProdutoDtoToProduct(dto: ProdutoDto): Product {
  return {
    id: String(dto.id),
    name: dto.nome,
    description: dto.descricao,
    price: dto.preco,
    currency: dto.moeda,
    typeCode: dto.tipo,
    typeLabel: TYPE_LABELS[dto.tipo] ?? 'Outros',
    active: dto.ativo,
    imageUrl: dto.imagemUrl ?? undefined,
    createdAt: dto.criadoEm,
  };
}
