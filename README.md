# E-commerce Gráfica — Frontend

Aplicação Next.js com arquitetura **feature-based**, dados **mockados** e UI completa (loja, auth, checkout, pedidos e painel admin).

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui
- TanStack Query, Zustand, Zod, React Hook Form

## Estrutura

```
src/
├── app/              # Rotas (route groups: storefront, auth, admin)
├── features/         # Domínios (catalog, cart, auth, checkout, orders, admin, account)
├── entities/         # Tipos de domínio do frontend
└── shared/           # UI base, utils (sem HTTP nesta fase)
```

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Demo (mock)

- **Login:** qualquer e-mail/senha (mín. 4 caracteres)
- **Admin:** use um e-mail contendo `admin` (ex.: `admin@loja.com`)
- Rotas protegidas (`/checkout`, `/pedidos`, `/conta`, `/admin`) exigem login (cookie `mock-auth`)

## Próxima fase

Integração HTTP com API .NET — ver `src/shared/api/README.md`.
