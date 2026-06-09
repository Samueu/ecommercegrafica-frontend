export const endpoints = {
  catalog: {
    products: '/api/Produtos',
    product: (id: string | number) => `/api/Produtos/${id}`,
  },
} as const;
