# E-commerce Gráfica: como funciona uma loja virtual completa para gráfica online

Construir um e-commerce do zero exige ir além de uma vitrine de produtos. É preciso pensar em autenticação segura, catálogo com imagens, carrinho, checkout, pedidos, área administrativa e armazenamento de mídia na nuvem. O **E-commerce Gráfica**, loja da **Maria Cristina Gráfica**, nasceu exatamente com esse desafio: uma aplicação full stack desenvolvida com **Next.js 16**, **.NET 9** e **PostgreSQL**, cobrindo o ciclo essencial de uma gráfica online, do catálogo ao painel admin.

**Autor:** Samuel Batista de Souza

**Demonstração online:** https://mariacristinagrafica.shop/

**Todos os direitos reservados.** Este material, incluindo o código, a documentação e o conteúdo aqui descrito, é de propriedade de Samuel Batista de Souza. Reprodução, distribuição ou uso comercial sem autorização prévia são proibidos.

Neste artigo, explico como a aplicação funciona por dentro e por fora: a estrutura do projeto, as jornadas de cliente e administrador, o fluxo de cadastro de produtos com upload de imagens, a arquitetura do frontend e do backend, a API REST, o banco de dados, as integrações externas e como executar tudo localmente. O objetivo é que qualquer pessoa de perfil técnico ou não consiga entender o que foi construído e por que cada decisão faz sentido no contexto de um MVP evolutivo.

---

## O que é o E-commerce Gráfica

O E-commerce Gráfica é uma loja virtual web voltada a materiais gráficos: cartões de visita, banners, folders, adesivos e convites. Na prática, a aplicação cobre as funcionalidades essenciais de um e-commerce B2C, catálogo, carrinho, autenticação, área do cliente e painel administrativo, com integração real entre frontend e API em produção.

O modelo adotado é o de **loja com dois perfis principais**: o **cliente** navega, compra e acompanha pedidos; o **administrador** gerencia produtos, incluindo upload de múltiplas imagens por item. Checkout e histórico de pedidos no frontend ainda operam parcialmente com dados mockados, enquanto auth, catálogo e cadastro de produtos já consomem a API real, uma estratégia incremental que permitiu publicar o núcleo da loja sem bloquear a evolução do restante.

Do ponto de vista tecnológico, o projeto é dividido em duas aplicações independentes: o **frontend**, uma aplicação Next.js que roda no navegador, e o **backend**, uma API REST construída em .NET 9 que centraliza regras de negócio, persistência e integrações. Os dados ficam em **PostgreSQL**; imagens de produtos são armazenadas na nuvem via **Cloudflare R2**. Tudo está publicado no **Render**, com front e API em subdomínios dedicados.

[INSERIR IMAGEM: capa]

Legenda sugerida: Página inicial do E-commerce Gráfica, loja online desenvolvida por Samuel Batista de Souza — https://mariacristinagrafica.shop/

---

## Estrutura do projeto

O projeto está organizado em dois repositórios independentes.

O repositório **ecommercegrafica-backend** concentra toda a API: controllers HTTP, services de negócio, acesso ao banco de dados, autenticação JWT, upload de arquivos para R2 e configuração de dependências. É aqui que as regras de negócio são aplicadas e validadas.

O repositório **ecommercegrafica-frontend** contém a interface da loja: páginas, componentes visuais, gerenciamento de estado no navegador e comunicação com a API. A aplicação é construída com Next.js 16, React 19 e TypeScript.

**Como frontend e backend se comunicam**

Em ambiente de desenvolvimento, o frontend roda na porta 3000 e o backend na porta 5189. A variável `NEXT_PUBLIC_API_URL` aponta para a URL base da API. Todas as requisições usam `fetch` com `credentials: 'include'`, enviando cookies httpOnly de sessão (`eg_at`, `eg_rt`) em chamadas cross-site.

Em produção, o frontend está em **https://mariacristinagrafica.shop** e a API em **https://api.mariacristinagrafica.shop**. O backend configura CORS com origens explícitas e `AllowCredentials()`, permitindo que o navegador envie cookies de autenticação entre subdomínios distintos.

**Traduzindo:** o usuário interage apenas com o navegador. Por trás, cada ação gera uma requisição HTTP para a API .NET. A API consulta o PostgreSQL para dados persistentes (usuários, produtos, pedidos) e o Cloudflare R2 para arquivos (imagens de produto). O frontend nunca acessa o banco ou o storage diretamente, tudo passa pela API.

---

## Perfis de usuário e jornadas

Cada tipo de usuário tem uma jornada distinta dentro da loja. O sistema garante que cada perfil acesse somente o que lhe compete, por meio de autenticação JWT e controle de papéis (roles `customer` e `admin`).

### Cliente

O cliente é o usuário padrão registrado na plataforma. Ao criar uma conta em `/cadastro`, recebe automaticamente o papel de **customer**, com registro vinculado a um cadastro de cliente no banco.

Sua jornada começa na home, onde visualiza produtos em destaque e pode navegar pelo catálogo em `/produtos`. Na página de detalhe, o cliente vê preço, descrição, tipo de material e **carrossel de imagens** (galeria com múltiplas fotos quando disponível).

É possível adicionar itens ao carrinho, persistido localmente no navegador via Zustand e acessar `/checkout` após login. O fluxo de checkout e a listagem de pedidos em `/pedidos` ainda utilizam dados mockados no frontend, embora a API de pedidos já exista e esteja pronta para integração.

A área `/conta` exibe dados da sessão autenticada (`GET /api/auth/me`) e permite exclusão de conta (LGPD) via `DELETE /api/auth/me`.

### Administrador

O administrador tem acesso ao painel em `/admin`, com visão de dashboard, produtos, pedidos e estoque.

Em `/admin/produtos`, lista o catálogo e cadastra novos itens via formulário com **upload de até 8 imagens** por produto. O arquivo é enviado em `multipart/form-data` para `POST /api/Produtos`; o backend valida tipo (JPG, PNG, WEBP) e tamanho (máx. 5 MB por imagem), faz upload para o R2 e persiste as URLs no banco.

Pedidos e estoque no painel admin ainda exibem dados mockados, mas a estrutura de rotas e layout já está preparada para consumir a API real.

[INSERIR IMAGEM: login]

Legenda sugerida: Autenticação por e-mail e senha; após o login, o sistema direciona cada usuário conforme seu papel.

[INSERIR IMAGEM: painel admin ou catálogo]

Legenda sugerida: Catálogo público e painel administrativo — cada perfil acessa apenas as funcionalidades permitidas.

**Traduzindo:** a loja não é apenas uma vitrine estática. O cliente descobre e compra produtos; o administrador mantém o catálogo atualizado com imagens reais na nuvem, sem depender de deploy manual a cada alteração.

---

## Fluxo completo: do cadastro de produto à compra

Entender os fluxos principais é a chave para compreender toda a aplicação.

### Fluxo A — Cadastro de produto (admin)

**Passo 1 — Autenticação**

O administrador faz login em `/login`. A API valida e-mail e senha (BCrypt), emite JWT e grava cookies httpOnly (`eg_at` com 15 min, `eg_rt` com 7 dias para refresh).

**Passo 2 — Formulário de produto**

No painel admin, o administrador preenche nome, descrição, preço, tipo (cartão, banner, folder, adesivo, convite) e seleciona uma ou mais imagens.

**Passo 3 — Upload para R2**

O frontend monta um `FormData` e envia `POST /api/Produtos`. O backend valida o arquivo, gera object key (`produtos/{timestamp}-{guid}.{ext}`), faz `PutObject` no Cloudflare R2 e obtém a URL pública (`*.r2.dev`).

**Passo 4 — Persistência**

As URLs são salvas em `produto_imagens` (galeria ordenada) e sincronizadas em `produtos.imagem_url` (capa). A API responde `201 Created` com o produto completo.

**Passo 5 — Catálogo público**

Imediatamente, o produto aparece em `GET /api/Produtos` e na loja para qualquer visitante.

### Fluxo B — Compra (cliente)

**Passo 1 — Navegação**

O cliente explora o catálogo (dados reais da API) e abre o detalhe do produto com carrossel de imagens.

**Passo 2 — Carrinho**

Adiciona itens ao carrinho (estado local Zustand + `localStorage`). Não exige login nesta etapa.

**Passo 3 — Checkout**

Ao finalizar, o cliente precisa estar autenticado. O checkout atual simula endereço, frete e pagamento no frontend (mock). A integração com `POST /api/Pedidos` está prevista como próxima fase.

**Passo 4 — Pedido (futuro)**

Quando integrado, a API validará estoque/endereço, congelará preço e nome do produto no item do pedido e definirá status inicial `AguardandoPagamento`.

[INSERIR IMAGEM: detalhe produto]

Legenda sugerida: Página de detalhe com carrossel de imagens do produto.

[INSERIR IMAGEM: formulário admin]

Legenda sugerida: Administrador cadastra produto com upload de múltiplas imagens para a nuvem.

[INSERIR IMAGEM: carrinho]

Legenda sugerida: Carrinho de compras persistente no navegador.

**Traduzindo:** o fluxo de cadastro com upload já está completo e em produção. O fluxo de compra tem a UI pronta e a API de pedidos implementada — falta conectar frontend e backend nessa etapa.

---

## Frontend: como a interface funciona

A interface foi construída com tecnologias modernas e amplamente adotadas no mercado.

### Stack tecnológica

- **Next.js 16** — framework React com App Router, SSR e roteamento baseado em pastas.
- **React 19** — biblioteca para interfaces reativas.
- **TypeScript** — tipagem estática que reduz erros e melhora legibilidade.
- **Tailwind CSS 4** — estilização utility-first com design system consistente.
- **shadcn/ui** — componentes acessíveis baseados em Radix UI.
- **TanStack Query** — cache e fetching de dados da API.
- **Zustand** — estado global do carrinho com persistência em `localStorage`.
- **React Hook Form + Zod** — formulários e validação.

### Organização por funcionalidades

O código-fonte está dividido em módulos por domínio (feature-based):

- **auth** — login, cadastro, logout, sessão e exclusão de conta (API real).
- **catalog** — home, listagem, detalhe de produto e cadastro admin (API real).
- **cart** — carrinho local (Zustand).
- **checkout** — wizard de finalização (mock).
- **orders** — histórico de pedidos (mock).
- **account** — perfil e preferências (leitura real + edição mock).
- **admin** — dashboard, produtos (API real), pedidos e estoque (mock).

### Layouts e navegação

A aplicação utiliza route groups do Next.js:

- **(storefront)** — loja pública: `/`, `/produtos`, `/carrinho`, `/checkout`, `/pedidos`, `/conta`.
- **(auth)** — `/login`, `/cadastro`, `/recuperar-senha`.
- **(admin)** — `/admin`, `/admin/produtos`, `/admin/pedidos`, `/admin/estoque`.

### Comunicação com a API

Todas as requisições passam por `apiFetch` em `shared/api/http-client.ts`:

- Prefixa URLs com `NEXT_PUBLIC_API_URL`.
- Usa `credentials: 'include'` para cookies httpOnly.
- Detecta `FormData` e não força `Content-Type` (boundary multipart automático).
- Trata erros via `ApiError`, lendo `{ erro }` do backend.

**Fluxo de autenticação no navegador:** login → API devolve cookies httpOnly → requisições subsequentes incluem cookies automaticamente → `GET /api/auth/me` restaura sessão ao recarregar a página.

[INSERIR IMAGEM: home catálogo]

Legenda sugerida: Vitrine de produtos gráficos na home da loja.

[INSERIR IMAGEM: cadastro produto admin]

Legenda sugerida: Formulário admin com preview de múltiplas imagens antes do envio.

**Traduzindo:** o frontend é a porta de entrada do usuário. Toda a experiência visual — da vitrine ao painel admin — passa por essa camada, que se comunica exclusivamente com a API REST do backend.

---

## Backend: arquitetura e camadas

O backend foi projetado com **Clean Architecture light**, separando responsabilidades de forma clara. A API roda em **.NET 9** e expõe endpoints REST documentados via Swagger.

### Os cinco projetos

A solution .NET é composta por cinco projetos interdependentes:

- **ecommercegrafica** (Web) — camada de entrada HTTP. Contém controllers, `Program.cs`, middleware de exceções e Swagger.

- **EcommerceGrafica.Application** — regras de negócio. Services (`ProdutoService`, `AuthService`, `PedidoService`, `ClienteService`), JWT, BCrypt, upload R2.

- **EcommerceGrafica.Domain** — núcleo do domínio. Models, enums (`TipoProduto`, `StatusPedido`, `UserRole`), DTOs, interfaces e settings tipadas.

- **EcommerceGrafica.Repository** — persistência PostgreSQL via **Dapper** (SQL explícito). Scripts `Schema.sql` e `Seed.sql` aplicados no startup.

- **EcommerceGrafica.Setup** — composition root. Registra dependências no container DI.

### Fluxo interno de uma requisição

Quando uma requisição HTTP chega, o controller recebe, extrai dados do body ou form e chama o service adequado. O service aplica regras de negócio, consulta repositórios e, quando necessário, invoca serviços de infraestrutura (R2, JWT).

Erros de domínio (`DomainException`) são capturados pelo `ExceptionHandlingMiddleware` e devolvidos como `400 { "erro": "..." }`. Demais exceções retornam `500` genérico.

### Documentação interativa

A API expõe Swagger em `/swagger`, permitindo testar endpoints diretamente no navegador.

[INSERIR IMAGEM: swagger]

Legenda sugerida: Documentação interativa da API em https://api.mariacristinagrafica.shop/swagger

**Traduzindo:** a arquitetura em camadas garante que regras de negócio não fiquem misturadas com HTTP ou SQL. Cada camada tem responsabilidade clara, facilitando manutenção e evolução.

---

## API REST: endpoints e autenticação

A API agrupa rotas por domínio, todas sob prefixos `/api`.

### Autenticação

- **POST /api/auth/register** — cadastro + cria cliente + cookies JWT (rate limit: 10 req/min).
- **POST /api/auth/login** — login por e-mail/senha + cookies.
- **POST /api/auth/refresh** — rotação de access + refresh token.
- **POST /api/auth/logout** — revoga sessão, limpa cookies.
- **GET /api/auth/me** — usuário autenticado.
- **DELETE /api/auth/me** — exclusão de conta (LGPD, pseudonimização).

Senhas armazenadas com hash **BCrypt** (work factor 12). JWT HMAC-SHA256 com claims `sub`, `email`, `role`. Cookies httpOnly: `eg_at` (15 min) e `eg_rt` (7 dias, path `/api/auth`).

### Catálogo (acesso público)

- **GET /api/Produtos** — listagem de produtos ativos com galeria de imagens.
- **GET /api/Produtos/{id}** — detalhe de um produto.

### Produtos (admin)

- **POST /api/Produtos** — cria produto via multipart (até 8 imagens → R2). Requer role `admin`.

### Clientes e pedidos

- **GET/POST /api/Clientes** — listagem e cadastro (admin).
- **GET/POST /api/Pedidos** — listagem e criação de pedidos (autenticado).

### Admin (configuração)

- **GET /api/admin/config/r2** — status da configuração R2 (admin, sem expor secrets).

[INSERIR IMAGEM: resposta login ou produto criado]

Legenda sugerida: Resposta da API após cadastro de produto com URL de imagem no R2.

**Traduzindo:** a API é o contrato entre frontend e backend. Cada endpoint tem autenticação, validação e regras de negócio definidas.

---

## Banco de dados e persistência

O projeto utiliza **PostgreSQL** como banco principal. O acesso é feito via **Dapper**, executando SQL direto sem Entity Framework.

### Bootstrap automático

Scripts SQL são aplicados na inicialização da API (`DatabaseBootstrapper`):

- **Schema.sql** — cria tabelas (idempotente).
- **Seed.sql** — insere produtos e usuários de demonstração.

### Tabelas principais

- **produtos** — catálogo com nome, descrição, preço, moeda, tipo, ativo, imagem_url (capa).
- **produto_imagens** — galeria ordenada (produto_id, url, ordem).
- **clientes** — cadastro de clientes (e-mail único).
- **pedidos** — pedidos com status, endereço de entrega.
- **itens_pedido** — itens com snapshot de nome e preço unitário.
- **usuarios** — contas com senha hash, role, consentimento LGPD.
- **refresh_tokens** — tokens de refresh com rotação e revogação.
- **auth_audit** — auditoria de eventos de autenticação.

### Dados de demonstração

| E-mail | Senha | Perfil |
|--------|-------|--------|
| admin@loja.com | Admin@123 | admin |
| maria.silva@example.com | Cliente@123 | customer |

Também há três produtos seed (Cartão de Visita, Banner, Folder) para explorar o catálogo imediatamente.

**Traduzindo:** o banco é a memória persistente da loja. Toda informação que precisa sobreviver a reinicializações — contas, produtos, imagens, pedidos — vive nessas tabelas, acessadas exclusivamente pelo backend.

---

## Integrações externas

### Cloudflare R2

Armazenamento de objetos compatível com API S3. Utilizado para **imagens de produtos** (pasta `produtos/` no bucket `ecommercegrafica-produtos`).

O banco guarda apenas URLs públicas (`*.r2.dev`), nunca binários. O fluxo: admin envia multipart → backend valida → upload R2 → persiste URLs em `produto_imagens`.

Variáveis de ambiente no Render: `R2__AccountId`, `R2__AccessKeyId`, `R2__SecretAccessKey`, `R2__BucketName`, `R2__PublicBaseUrl` (atenção ao spelling exato — typos impedem upload em produção).

### Render

Hospedagem de frontend, API e PostgreSQL. Deploy via Docker (backend) e `render.yaml`. CORS configurado para cross-site entre `mariacristinagrafica.shop` e `api.mariacristinagrafica.shop`.

[INSERIR IMAGEM: produto com imagem R2]

Legenda sugerida: Imagem de produto servida via URL pública do Cloudflare R2.

**Traduzindo:** o R2 resolve armazenamento escalável de mídia; o Render simplifica deploy e operação sem gerenciar servidores manualmente.

---

### Pontos fortes

Apesar do escopo evolutivo, o E-commerce Gráfica entrega um fluxo real de loja online: catálogo com galeria, autenticação segura com cookies httpOnly, cadastro admin com upload multi-imagem, LGPD (consentimento e exclusão de conta), API documentada e deploy em produção. O código está organizado em camadas e features, pronto para servir como referência de portfólio full stack.

---

## Conclusão

O E-commerce Gráfica demonstra que é possível construir uma loja virtual funcional para uma gráfica online, utilizando tecnologias modernas e arquitetura bem definida. Do ponto de vista do cliente, a experiência cobre descoberta de produtos, carrinho e autenticação. Do ponto de vista do administrador, há cadastro de produtos com imagens na nuvem e controle de acesso por perfil.

Tecnicamente, o projeto combina frontend Next.js 16 com React 19 e TypeScript, backend .NET 9 em camadas, persistência PostgreSQL via Dapper, autenticação JWT com cookies httpOnly, armazenamento Cloudflare R2 e deploy no Render, tudo conectado por uma API REST documentada em Swagger.

Construir este projeto foi um exercício completo de engenharia de software: da modelagem de domínio e regras de negócio até a experiência do usuário e publicação em produção. Cada camada foi pensada para ser compreensível, evolutiva e representativa de um sistema real.

**Explore a loja:** https://mariacristinagrafica.shop/

**Autor:** Samuel Batista de Souza

**Todos os direitos reservados.** Este material, incluindo o código, a documentação e o conteúdo aqui descrito, é de propriedade de Samuel Batista de Souza. Reprodução, distribuição ou uso comercial sem autorização prévia são proibidos.

Se este artigo foi útil, sinta-se à vontade para comentar, compartilhar ou entrar em contato. Adoraria ouvir sua opinião sobre e-commerce, arquitetura full stack ou desenvolvimento de MVPs.

#DesenvolvimentoWeb #NextJS #DotNet #Ecommerce #Portfolio #FullStack #React #TypeScript #PostgreSQL #Cloudflare #Render

---

## Post-resumo para o feed (opcional)

Use o texto abaixo como post curto no feed do LinkedIn, com link para o artigo completo:

---

Construí um e-commerce completo para gráfica online e documentei tudo.

O E-commerce Gráfica (Maria Cristina Gráfica) é uma loja full stack com catálogo real, autenticação segura, upload de imagens na nuvem e painel administrativo, já publicado em produção.

No artigo, explico:

- Como funcionam as jornadas de cliente e administrador
- O fluxo de cadastro de produtos com upload para Cloudflare R2
- A arquitetura full stack: Next.js 16 + .NET 9 + PostgreSQL + Render

Acesse a loja: https://mariacristinagrafica.shop/

Projeto desenvolvido por Samuel Batista de Souza.

Leia o artigo completo: [link do artigo]

#DesenvolvimentoWeb #NextJS #DotNet #Ecommerce #FullStack

---

## Instruções para publicação no LinkedIn

1. Copie o conteúdo deste arquivo (do título principal até as hashtags) para o editor de **Artigos** do LinkedIn.
2. Nos pontos marcados com `[INSERIR IMAGEM: ...]`, use o botão "Adicionar mídia" e faça upload da screenshot correspondente.
3. Defina a imagem de capa do artigo (sugestão: screenshot da home em https://mariacristinagrafica.shop/).
4. Revise ortografia e estilo antes de publicar.
5. Opcionalmente, publique o post-resumo no feed com link para o artigo.

### Checklist de imagens

1. Capa — Home da loja (https://mariacristinagrafica.shop/)
2. Login — Tela de autenticação (/login)
3. Catálogo ou admin — Vitrine ou painel (/produtos ou /admin)
4. Detalhe produto — Carrossel de imagens (/produtos/[id])
5. Formulário admin — Cadastro com upload (/admin/produtos)
6. Carrinho — Itens adicionados (/carrinho)
7. Swagger — Documentação da API (https://api.mariacristinagrafica.shop/swagger)
8. Produto R2 — Imagem carregada do bucket na nuvem
9. Resposta API — Produto criado com URL de imagem (DevTools ou Swagger)
10. Terminal — Backend e frontend rodando localmente (opcional)
