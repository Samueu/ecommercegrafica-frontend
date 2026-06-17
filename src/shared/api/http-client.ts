import { env } from '@/shared/config/env';

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }

  /**
   * Tenta extrair a mensagem amigável devolvida pelo backend
   * (formato { erro: string } do ExceptionHandlingMiddleware).
   */
  get friendlyMessage(): string {
    if (this.body && typeof this.body === 'object' && 'erro' in this.body) {
      const erro = (this.body as { erro?: unknown }).erro;
      if (typeof erro === 'string' && erro.trim().length > 0) {
        return erro;
      }
    }
    return this.message;
  }
}

type ApiFetchInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /**
   * Define se a requisição deve enviar cookies cross-site.
   * O default é 'include' porque a sessão fica em cookies httpOnly.
   */
  credentials?: RequestCredentials;
};

export async function apiFetch<T>(path: string, init: ApiFetchInit = {}): Promise<T> {
  const { body, headers, credentials = 'include', ...rest } = init;

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...rest,
    credentials,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text().catch(() => undefined);
    }
    throw new ApiError(
      `Falha na requisição (${response.status})`,
      response.status,
      errorBody,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
