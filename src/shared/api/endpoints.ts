export const endpoints = {
  catalog: {
    products: '/api/Produtos',
    product: (id: string | number) => `/api/Produtos/${id}`,
  },
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    me: '/api/auth/me',
  },
} as const;
