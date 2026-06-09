const DEFAULT_API_URL = 'https://ecommercegrafica-backend.onrender.com';

export const env = {
  apiUrl:
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : undefined) ??
    DEFAULT_API_URL,
} as const;
