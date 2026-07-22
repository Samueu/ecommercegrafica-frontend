const DEFAULT_API_URL = 'https://api.mariacristinagrafica.shop';

export const env = {
  apiUrl:
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : undefined) ??
    DEFAULT_API_URL,
} as const;
