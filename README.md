# E-commerce Gráfica — Frontend

Interface web da loja virtual **Maria Cristina Gráfica**, construída com **Next.js 16** e arquitetura **feature-based**.

**Autor:** Samuel Batista  
**Demonstração online:** [https://mariacristinagrafica.shop/](https://mariacristinagrafica.shop/)  
**API:** [https://api.mariacristinagrafica.shop](https://api.mariacristinagrafica.shop)

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui**
- **TanStack Query** — cache e fetching de dados
- **Zustand** — carrinho (persistido em `localStorage`)
- **React Hook Form** + **Zod** — formulários e validação

---

## Estrutura

```
src/
├── app/              # Rotas (storefront, auth, admin)
├── features/         # catalog, cart, auth, checkout, orders, admin, account
├── entities/         # Tipos de domínio
└── shared/           # UI, config, api (http-client, endpoints)
```

---

## Integração com a API

| Módulo | Status |
|--------|--------|
| Catálogo (listagem / detalhe) | ✅ API real |
| Login, cadastro, logout, sessão | ✅ API real |
| Cadastro de produto (admin) + upload de imagens | ✅ API real |
| Carrinho | ⚠️ Local (Zustand) |
| Checkout | ❌ Mock |
| Pedidos (cliente / admin) | ❌ Mock |
| Edição de perfil / recuperar senha | ❌ Mock |

A comunicação com a API usa `fetch` com `credentials: 'include'` (cookies httpOnly de sessão).

---

## Como rodar

### Pré-requisitos

- **Node.js 22+**
- Backend rodando localmente **ou** API de produção acessível

### Configuração

```bash
cp .env.example .env.local
npm install
npm run dev
```

Edite `.env.local`:

```env
# Produção (padrão)
NEXT_PUBLIC_API_URL=https://api.mariacristinagrafica.shop

# Dev local com backend Kestrel
# NEXT_PUBLIC_API_URL=http://localhost:5189
```

Acesse [http://localhost:3000](http://localhost:3000).

> Reinicie o dev server após alterar variáveis `NEXT_PUBLIC_*`.

---

## Contas de demonstração

Usuários criados pelo seed do backend (`Seed.sql`):

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | `admin@loja.com` | `Admin@123` |
| Cliente | `maria.silva@example.com` | `Cliente@123` |

- **Admin:** painel em `/admin` (produtos, pedidos, estoque)
- **Cliente:** catálogo, carrinho, checkout mock, pedidos mock

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |

---

## Deploy

Publicado no **Render** via `render.yaml`. Em produção, configure:

```env
NEXT_PUBLIC_API_URL=https://api.mariacristinagrafica.shop
```

O backend deve incluir a origem do front em `CorsAllowedOrigins`.

---

## Documentação complementar

- [`src/shared/api/README.md`](src/shared/api/README.md) — camada HTTP
- [`../doc/contexto-aplicacao.md`](../doc/contexto-aplicacao.md) — contexto técnico completo
- [`../doc/artigo-projeto-linkedin.md`](../doc/artigo-projeto-linkedin.md) — artigo para LinkedIn

---

## Licença

Projeto educacional / demonstrativo.
