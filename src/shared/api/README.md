# Camada de API (fase futura)

Nesta fase o frontend usa **dados mockados** em `src/features/*/mocks/`.

Quando houver integração HTTP, adicionar aqui:

- `http-client.ts` — wrapper `fetch` com tratamento de erros
- `endpoints.ts` — paths da API
- `query-keys.ts` — factories para TanStack Query
