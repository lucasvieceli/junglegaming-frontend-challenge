# Arquitetura — Kurio NFT Marketplace

> Visão técnica do projeto: decisões, fluxos de dados e limitações. Como rodar e testar está no `README.md`.

## Stack

| Responsabilidade | Tecnologia | Versão |
| --- | --- | --- |
| Interface | React | 19.2 |
| Linguagem | TypeScript (strict, `noUncheckedIndexedAccess`) | 6.0 |
| Build | Vite | 8.3 |
| Roteamento | TanStack Router (file-based, code-split automático) | 1.170 |
| Estado remoto | TanStack Query | 5.104 |
| Cliente HTTP | Axios | 1.20 |
| Contratos/validação | zod | 4.6 |
| Formulários | react-hook-form + @hookform/resolvers | 7.90 |
| Tempo real | socket.io-client | 4.8 |
| Estilização | Tailwind CSS (CSS-first, `@theme`) | 4.3 |
| Componentes | shadcn/ui (primitivos Radix) | CLI 4.21 |
| Mocking | MSW + @mswjs/socket.io-binding | 2.15 / 0.2.0 |
| Testes E2E/visual | Playwright + @axe-core/playwright | 1.64 |
| Auditoria | Lighthouse CI (@lhci/cli) | 0.15 |
| Aritmética decimal (ETH) | big.js | 7 |

## Estrutura de pastas

```
src/
  app/            providers, router, query client, env, guardas de rota, casca e composições entre features
  routes/         rotas file-based (só compõem páginas e definem search params/guards)
  features/<f>/   api/ (chamadas + hooks de query/mutation), components/, hooks/, lib/, pages/
  shared/
    api/          http-client, interceptors, ApiError, query keys
    contracts/    schemas zod (fonte única dos tipos de transporte)
    lib/          utilitários compartilhados (cn, money, pricing, hash, nft-image…)
    session/      sessão do usuário/visitante (store, hooks, ownerKey)
    ui/           primitivos shadcn adaptados ao Figma
    components/   componentes do app compartilhados (layout, icons, feedback, forms, media)
  mocks/          backend simulado (MSW): db, handlers, cenários, ws, API de controle
  styles/         tokens (globals.css), escala tipográfica (typography.css), fontes
e2e/              fixtures, page objects e specs do Playwright
scripts/          geração de ícones, otimização de imagens, Lighthouse, verificações de lint
docs/             relatório e justificativas do Lighthouse
```

## Convenções de código

- **Um componente React por arquivo**, com o nome do componente (`react/no-multi-comp`).
- Hooks em arquivos próprios; utilitários em `shared/lib` (ou `features/<f>/lib` quando exclusivos) — nunca duplicados (`sonarjs/no-identical-functions`).
- Uma feature não importa outra (`scripts/check-feature-imports.mjs`); código compartilhado sobe para `shared`.
- Tipografia só pelos utilitários `type-*` (`scripts/check-typography.mjs` proíbe `text-[..]`, `leading-[..]`, `tracking-[..]`, `font-[..]`).
- `axios` só em `src/shared/api`; `src/mocks` só é importado por `src/main.tsx` (`no-restricted-imports`).
- `npm run lint` roda ESLint (`--max-warnings=0`) + as duas verificações acima.

## Design system

- Tokens do Figma em `src/styles/globals.css` (`@theme`): cores, raios, sombras, gradientes, breakpoints. As variáveis semânticas do shadcn (`--color-background`, `--color-border`, …) apontam para os mesmos tokens.
- Escala tipográfica completa em `src/styles/typography.css` (`type-*`), com os valores exatos do Figma.
- Roboto Mono 400/500/700 self-host (`public/fonts`), pré-carregada no `index.html`, com fallback de métricas ajustadas.
- Ícones: gerados dos assets exportados do Figma por `npm run icons:generate`, um componente por ícone em `src/shared/components/icons` (`currentColor` quando monocromático).
- Artes: as 4 imagens do Figma convertidas para AVIF/WebP em 256/512/1024 px (`npm run images:optimize`), servidas por `NftImage` (`<picture>` + `srcset`).
- Os assets originais exportados do Figma ficam fora do repositório; ícones e imagens gerados a partir deles são versionados, então `icons:generate` e `images:optimize` só são necessários para regerar.

## Casca do app

- `src/app/layout/AppShell.tsx` compõe a casca: `SkipLink`, `SiteHeader` (≥ 1024px), `<main id="conteudo">`, `SiteFooter`, `MobileTabBar` (< 1024px, só em `/`, `/favorites`, `/account/*`) e `AppToaster` (topo central no mobile, canto inferior direito no desktop). Componentes de `shared/components/layout` recebem dados por props; quem os conecta à sessão/carrinho é a camada `app` (`useShellData`).
- Regras por rota em funções puras: item ativo da navegação (`nav-items.ts`), header com divisor (`shell-rules.ts`), rotas com tab bar (`tab-bar-items.ts`).
- Metadados por rota com `head` + `HeadContent` do TanStack Router (`shared/lib/page-head.ts`: "<Página> — Kurio").
- `OfflineBanner`: `navigator.onLine` não detecta API inacessível, então `QueryCache`/`MutationCache` reportam falhas de rede e respostas a `shared/lib/network-status.ts`.
- Ações e páginas fora do escopo (Criadores, Aprenda, links de ajuda, redes sociais, newsletter) usam `notifyOutOfScope` (toast informativo, nunca sucesso aparente).
- Formulários: `FormField` (render-prop com `id`/`aria-*`), `RequiredMark`, `FieldError`, `PasswordInput`, `SelectField`, `EnsInput` em `shared/components/forms`.

## Catálogo e detalhe

- Filtros do catálogo vivem na URL (`features/catalog/lib/catalog-search.ts`, schema zod com `.catch`): listas em CSV (`shared/lib/search-params.ts`, `parseSearch`/`stringifySearch` do router), padrões omitidos (`stripSearchParams`). Mudar filtro volta à página 1; busca digitada usa debounce de 300 ms e `replace`.
- `useNftList` usa uma chave por combinação de filtros + `signal` + `keepPreviousData`: respostas fora de ordem nunca substituem a lista ativa (spec 01, cenário `out-of-order`).
- Detalhe: o loader da rota garante o dado (`ensureQueryData`), 404 vira `notFound()` → "NFT não encontrado"; o componente lê do cache (`useSuspenseQuery`), então patches em tempo real aparecem sem recarregar. A página é remontada por NFT (`key`).
- Cards, preço, selo RARO, lightbox e a faixa de relacionados ficam em `shared/components/nft` porque são usados por catálogo, detalhe, favoritos e carrinho. As ações dos cards (carrinho/favoritar) chegam por `NftActionsContext`, implementado na camada `app` (que pode importar as features).
- `cn` conhece a escala `type-*` (tailwind-merge estendido), então `className` pode sobrescrever a tipografia de um componente.

## Decisões e desvios

| # | Decisão | Motivo |
| --- | --- | --- |
| D1 | ESLint 9 (não 10) | `eslint-plugin-react` 7.37 ainda não suporta ESLint 10. |
| D2 | TypeScript 6.0 | Versão do template atual do `create-vite`; `typescript-eslint` 8.71 compatível. |
| D3 | Primitivos shadcn em `src/shared/ui` mantêm vários subcomponentes por arquivo | São "biblioteca vendida" gerada pela CLI; isentos de `react/no-multi-comp`. Todo código do app segue a regra. |
| D4 | shadcn com Radix (`-b radix`, preset nova) | A CLI atual usa Base UI por padrão; o projeto usa Radix. Tokens e fonte do preset foram substituídos pelos do Figma. |
| D5 | Sem o componente `form` do shadcn | Não existe mais no registry atual; formulários usam react-hook-form + `FormField` próprio (`shared/components/forms`). |
| D6 | Sem `lucide-react` | Todos os ícones vêm do Figma; `CheckIcon` foi desenhado no mesmo traço (não existe no pacote) para indicadores não-cromáticos. |
| D7 | Tailwind varre apenas `src/` (`@import 'tailwindcss' source('..')`) | Evita gerar classes a partir de arquivos que não fazem parte do app (scripts, relatórios). |
| D8 | Apenas 4 artes reutilizadas nos NFTs | O Figma só contém 4 artes; as fixtures as distribuem entre os 36 NFTs. |
| D9 | `max-lines` desligado em `fixtures/nfts.ts` e `scenarios/presets.ts` | São tabelas de dados puros (sem lógica). |
| D11 | Tab bar mobile em 3 partes (laterais flexíveis + recorte central em SVG) | O SVG do Figma tem 414px fixos; esticá-lo deformaria o recorte do FAB. Recorte, raio 29 e sombra mantêm as medidas do Figma. |
| D12 | FAB da tab bar usa o glifo "scan" do Figma e abre a busca | O frame do Figma mostra o glifo de scan no botão central. |
| D13 | Botão voltar usa o chevron `90c5a` girado 90° | O asset "Arrow - Left 2" foi exportado sem a rotação. |
| D14 | Busca no desktop por diálogo (ícone do header); no mobile, barra do topo | O Figma desktop só tem o ícone; o mobile tem a barra "Explorar coleções". |
| D15 | Pontos do hero todos sólidos, como no Figma | Desktop 8px/gap 8, mobile 7px/gap 6. O slide atual é exposto por `aria-current`; os pontos dos relacionados seguem o Figma (inativo só com contorno). |
| D16 | "Preço anterior" sem risco | O Figma mostra o preço antigo em `secondary` sem risco; o leitor de tela recebe "Preço anterior:". |
| D17 | Pontos da galeria no hero mobile do detalhe, como no Figma | Asset do Figma (56×7) em x=179, y=365 do frame, sobre a arte; decorativo (`aria-hidden`). |
| D18 | Sessão, consultas de conta/carrinho e o sinal de cotação desatualizada em `shared` | São usados por várias features; como uma feature não importa outra, sobem para `shared`. |
| D19 | Mocks carregados por import dinâmico em `main.tsx`, depois da primeira pintura | A interface aparece sem esperar o MSW; só as requisições aguardam o worker (portão da API). O backend simulado faz parte do produto entregue. |
| D20 | Uma repetição automática por consulta (não duas) | O erro aparece mais cedo e o "Tentar novamente" manual cobre o resto (cenário `server-error`). |
| D21 | "Salvar" do perfil também troca a senha quando os campos de senha estão preenchidos | O Figma tem um único botão "Salvar" para as duas seções. |
| D22 | Alias de `tldts` para `src/mocks/vendor/tldts-lite.ts` | O MSW só usa o pacote (via `tough-cookie`) para cookies, que o mock não usa; a lista completa de sufixos pesava ~250 KB. |
| D23 | Relacionados e "Colecionadores também viram" com 7 itens em carrossel | Os pontos 52×12 do Figma indicam posição: com 5 visíveis e 7 itens há 3 posições, como no desenho. |
| D24 | Botão central da tab bar abre a busca com ordenação e filtros | O mobile não tem a barra lateral de filtros; o ícone do header (desktop) abre só a busca. |
| D25 | Aviso "Preço atualizado" no detalhe | Mudanças em tempo real de preço/disponibilidade são anunciadas na própria página (além do carrinho). |
| D26 | "Ordenar por" com a geometria do Figma | Bloco 300×18: rótulo em x=0, valor em x=110, seta de 16px em x=278/y=2 (sobre o fim de "Listados recentemente", como no desenho). |
| D27 | Estado do tempo real só para leitor de tela | Não existe no Figma, então fica visualmente oculto (`sr-only`); o `role="status"` anuncia conectado, reconectando ou offline da conexão Socket.IO. |
| D28 | Pílula de edição selecionada mais larga, como no Figma | Selecionada com padding 6 ("1/50" = 46px; as demais 42px). O aviso de máximo fica fora do fluxo, então nada abaixo se desloca. |
| D29 | Hero com slides de conteúdo próprio | O Figma desenha um único estado. O 1º slide mantém a boas-vindas do Figma; os demais apresentam o NFT em destaque com "VER NFT". O conteúdo entra na direção da navegação. |
| D30 | Barra de progresso na troca de rota, fade de página e animações de diálogos/selects | Estados não desenhados. A barra aparece após 150 ms (navegações rápidas não piscam); a primeira tela não anima (LCP); tudo respeita `prefers-reduced-motion`. |
| D31 | Área de toque dos pontos de carrossel limitada à metade do gap | Com 9px para cada lado, a área de um ponto cobria a do vizinho. |
| D32 | Conexão da carteira dentro das opções do Figma | As 3 opções de "Carteira e rede" (WalletConnect, MetaMask, Coinbase Wallet) mantêm 45px no desktop e 65px no mobile. Escolher uma opção usa a carteira cadastrada daquele tipo (ou a carteira informada em "Usar outra carteira?") e inicia a conexão simulada. Conectando, conectada (endereço curto + "Desconectar"), recusada e desconectada ("Tentar de novo") aparecem à direita, dentro da opção selecionada. No mobile, a etapa 2 é o frame: cartões das carteiras cadastradas, "Trocar carteira" (gerenciar carteiras), opções, Total e "Confirmar compra" no rodapé, que leva à revisão. Carrinho e pagamento mobile com margem lateral de 28px, como nos frames. |
| D33 | "Nome ENS" no pagamento só com o seletor ".eth" | Como no Figma; o nome vem do perfil do colecionador (ou da carteira) e aparece na revisão do pedido (desktop). |
| D34 | Abas "Detalhes / Avaliações" só no desktop | O frame mobile termina nos atributos; no mobile a nota e a contagem de avaliações ficam na pílula do título. |
| D35 | Ícone de mostrar senha no mobile em `secondary` | O Figma usa #55321F, com contraste abaixo de 3:1 sobre o fundo; o enunciado exige contraste legível. |
| D36 | Arte do card cresce até a arte do detalhe (View Transitions API via `viewTransition` do TanStack Router) | Sem dependência extra (framer-motion custaria ~30 KB e o `layoutId` não sobrevive à troca de rota com code-splitting). O skeleton do detalhe espera 400 ms para não substituir a página antes da animação; navegadores sem suporte navegam sem animar; `prefers-reduced-motion` desliga. |
| D37 | Chunks comuns pequenos embutidos no build (`build.rolldownOptions.output.codeSplitting.experimentalInlineCommonChunks`, com `preserveEntrySignatures: false`) | O Rolldown gerava dezenas de chunks de 0–1 KB; no 4G simulado cada requisição custa ~560 ms de latência. Embutidos, a Início cai de 70 para 31 requisições e o mobile sobe de 83 para 90 (Início) e de 82 para 87 (Detalhe), sem mudar o que cada página baixa. |
| D10 | Cenário `unauthorized` responde 403 (não 401) | 401 com sessão válida derrubaria a sessão pelo interceptor; 403 testa "sem permissão" sem efeito colateral. |

## Contratos e camada de dados

- **Contratos**: schemas zod em `src/shared/contracts` são a fonte única dos tipos (transporte → estado → UI). O mock valida o que responde e o cliente valida o que recebe. Detalhe de cada endpoint/erro: seção "Contratos REST" abaixo.
- **ETH**: sempre string decimal (até 6 casas) no transporte; aritmética só com `big.js` (`shared/lib/money.ts`); `computePricing` (`shared/lib/pricing.ts`) é a implementação única usada pelo mock (referência) e pelo cliente (só parciais otimistas).
- **HTTP**: um único `axios` (`shared/api/http-client.ts`, timeout 8 s, adapter `fetch`). Interceptors injetam `Authorization`/`X-Guest-Id` e normalizam toda falha em `ApiError` (`status`, `code`, `message`, `fieldErrors`, `details`, `retryable`, `isNetwork`). A sessão se conecta ao cliente por `configureHttpAuth` (sem acoplar `shared` à feature de auth); 401 em requisição autenticada aciona `onUnauthorized` (expiração).
- **Query keys**: `shared/api/query-keys.ts`; chaves privadas sempre incluem `userId`/`ownerKey`.

## Contratos REST

Base `VITE_API_URL` (`/api`). Autenticação por `Authorization: Bearer <token>`; visitante identificado por `X-Guest-Id`. Corpos e respostas validados pelos schemas de `src/shared/contracts` (mesmos tipos no mock e no cliente). Erros: `{ error: { code, message, fieldErrors?, details?, retryable } }`.

| Recurso | Método e rota | Resposta | Erros principais |
| --- | --- | --- | --- |
| Sessão | `POST /auth/register` | `201 AuthResponse` | 409 `EMAIL_TAKEN`/`USERNAME_TAKEN` (por campo), 422 |
| | `POST /auth/login` | `AuthResponse` | 401 `INVALID_CREDENTIALS` |
| | `GET /auth/session` | `AuthResponse` (renova) | 401 sessão inválida/expirada |
| | `POST /auth/logout` | `204` | |
| NFTs | `GET /nfts?q&categories&networks&priceMin&priceMax&sort&tab&page&pageSize` | `NftListResponse` (itens + facetas) | 400 |
| | `GET /nfts/featured` | `FeaturedResponse` | 503 (cenário) |
| | `GET /nfts/:id` | `NftDetail` | 404 `NFT_NOT_FOUND` |
| Favoritos | `GET /favorites` · `PUT/DELETE /favorites/:nftId` | `{ items }` · `204` | 401, 403 (cenário), 503 (cenário) |
| Carrinho | `GET /cart` · `POST /cart/items` · `PATCH/DELETE /cart/items/:itemId` · `POST /cart/merge { guestId }` | `Cart` | 404, 409 `QUANTITY_EXCEEDS_AVAILABILITY`/`EDITION_UNAVAILABLE` (com `details.cart`) |
| Cupom | `POST /cart/coupon { code }` · `DELETE /cart/coupon` | `Cart` | 422 `COUPON_INVALID`/`COUPON_EXPIRED` |
| Cotação | `POST /cart/quote { couponCode?, network? }` | `Quote` (itens, pricing, `changes`) | 409 `EDITION_UNAVAILABLE`, 422 cupom |
| Pedidos | `POST /orders` + `Idempotency-Key` | `201 Order` (200 na repetição) | 409 `IDEMPOTENCY_KEY_REUSED`/`QUOTE_STALE`/`EDITION_UNAVAILABLE`/`WALLET_CONNECTION_REJECTED`, 422 |
| | `GET /orders` · `GET /orders/:id` | `{ items }` · `Order` | 403 (outro usuário), 404 |
| Perfil | `GET/PATCH /me` · `PUT/DELETE /me/avatar` · `POST /me/password` | `User` · `{ avatarUrl }` · `204` | 409 e-mail/usuário em uso, 422 `CURRENT_PASSWORD_INVALID`/`AVATAR_TOO_LARGE` |
| Carteiras | `GET /wallets` · `POST /wallets` · `PATCH/DELETE /wallets/:id` | `{ items }` · `Wallet` | 409 `WALLET_KIND_EXISTS`/`PRIMARY_WALLET_REQUIRED`, 422 |
| Conexão | `POST /wallets/:id/connect { network }` · `POST /wallets/connect-custom` · `POST /wallets/:id/disconnect` · `GET /wallets/:id/connection` | `ConnectWalletResponse` · `WalletConnection` | 409 `WALLET_CONNECTION_REJECTED` |

Falhas transitórias (503, rede, timeout de 8 s) são marcadas `retryable` e repetidas uma vez nas consultas; mutações nunca repetem sozinhas (o pedido usa a chave de idempotência para reenvio seguro).

## Eventos Socket.IO

| Evento | Direção | Payload | Efeito no cliente |
| --- | --- | --- | --- |
| `nft.updated` | servidor → todos | `{ nftId, price, previousPrice, availability, editions[{id, available}], reason }` | Corrige listas, detalhe, destaques e favoritos; se está no carrinho: revalida o carrinho, marca a cotação como desatualizada e avisa |
| `order.updated` | servidor → dono | `{ orderId, status, transaction, declineReason }` | Atualiza o pedido; confirmado → recibo e revalida carrinho/catálogo; recusado → estado recusado |
| `session.identify` | cliente → servidor | `{ token, guestId }` | Reassocia a conexão ao usuário após conectar |
| `realtime.resync` | servidor → cliente | `{ reason: 'reconnected' }` | A partir da 2ª conexão, reconcilia os recursos ativos com a API |

Envelope de todo evento de domínio: `{ id, type, resource: { type, id }, version, occurredAt, userId, payload }` (`id` estável por evento, `version` monotônica por recurso).

## Camada de mocks, cenários e limitações do transporte

Resumo (detalhes, tabela de cenários e credenciais em `src/mocks/README.md`):

- Backend completo em `src/mocks`: DB persistido (`localStorage`) com reset integral, handlers REST (um arquivo por recurso), serviços de domínio (carrinho, cotação, pedidos, carteiras), 23 cenários determinísticos e API de controle `window.__kurio`.
- `withScenario` aplica latência, offline, falhas e timeouts. Nos timeouts o resolver roda **antes** do atraso: o MSW não cancela o resolver quando o cliente aborta, então atrasar antes duplicaria efeitos (pedido criado duas vezes).
- Idempotência de pedidos: a chave é verificada antes de qualquer outra validação e gravada na mesma transação da criação.
- Socket.IO via `@mswjs/socket.io-binding` com `ws.link(origem)`, keepalive de PING e `realtime.resync` após o handshake. Limitações: só WebSocket, namespace padrão, sem acks/binário/rooms, auth pela query.
- O painel de cenários é montado numa raiz React própria por `src/main.tsx`; o app não importa nada de `src/mocks` (regra de lint).

## Sessão e autenticação

- `shared/session/session-store.ts` é a fonte única da sessão no cliente: token, usuário e `expiresAt` em `localStorage['kurio.session']`, nunca a senha. É lido pelo React (`useSession`) e pelo interceptor HTTP. A leitura do storage é preguiçosa, depois do boot dos mocks.
- `AuthProvider` (camada `app`) liga o cliente HTTP à sessão e confirma a sessão salva com `GET /auth/session`. As guardas de rota (`app/guards.ts`) esperam essa confirmação.
- Rotas privadas (`/checkout`, `/orders/:id`, `/account/*`, `/favorites`) levam ao login com `?redirect=` e voltam exatamente para lá. Login/cadastro com usuário logado seguem para o destino. Só caminhos internos são aceitos em `redirect`.
- Expiração: um 401 em requisição autenticada ou o `expiresAt` vencido (verificado a cada 5 s) limpa o cache inteiro, avisa por toast e leva ao login com `redirect`. O rascunho do checkout fica no storage por usuário e é restaurado ao entrar de novo.
- Logout limpa sessão, cache e rascunhos. Trocar de usuário não vaza dados: toda chave privada inclui `userId`/`ownerKey`.

## Carrinho e checkout

- O carrinho é do servidor. O dono é o usuário ou o visitante (`X-Guest-Id`), e a chave de cache é `['cart', ownerKey]`. Ao entrar, `POST /cart/merge` junta os itens do visitante aos do usuário.
- Todas as mutações recebem o carrinho atualizado. Alterar quantidade é otimista: os totais são recalculados com a mesma regra do servidor só para exibição, com rollback em erro. Nos 409 de disponibilidade, o servidor devolve o carrinho atual, que é aplicado.
- Os valores exibidos (subtotal, desconto, taxa, total) vêm sempre da API, como strings decimais. A aritmética usa `big.js` (`shared/lib/money.ts`, `pricing.ts`).
- Checkout (`features/checkout`): um controlador (`useCheckoutController`) reúne formulário, cotação, conexão da carteira e envio, e é usado pelas versões desktop e mobile.
  - A cotação (`POST /cart/quote`) é refeita a cada versão do carrinho, cupom ou rede. A taxa acompanha a rede da carteira.
  - Mudanças listadas pelo servidor, ou um evento em tempo real (`quoteFreshness.markStale`), bloqueiam a confirmação até "Atualizar cotação".
  - Antes da revisão, formulário e cotação são revalidados. Se o total mudou, o envio não acontece.
  - Desktop: diálogo de revisão. Mobile: etapas (`?step=1..3`), e a 3ª etapa é a revisão.
- Pedido idempotente (`useSubmitOrder`): a tentativa (chave + corpo exato) fica em `localStorage` por usuário até uma resposta terminal.
  - Timeout ou falha de rede reenviam uma vez após 2 s com a mesma chave e o mesmo corpo; depois o reenvio é manual.
  - Ao recarregar com tentativa pendente, a tela oferece "Reenviar". Com o pedido já conhecido, a guarda abre o pedido.
  - Uma nova chave só é criada depois de uma recusa definitiva ou de um cancelamento explícito.
- Pedido: `pending` → `confirmed` | `declined`. O estado terminal nunca volta a pendente. O recibo lê só o snapshot do pedido. Com o tempo real fora do ar, a tela consulta o pedido a cada 5 s.

## Cache, retry e invalidação

| Dado | Chave | `staleTime` | Observações |
| --- | --- | --- | --- |
| Lista do catálogo | `['nfts','list',params]` | 30 s | `keepPreviousData`, `signal` cancela a anterior |
| Destaques | `['nfts','featured']` | 60 s | |
| Detalhe | `['nfts','detail',id]` | 60 s | carregado no loader da rota; 404 → "NFT não encontrado" |
| Carrinho | `['cart',ownerKey]` | 0 | sempre revalida |
| Cotação | `['quote',ownerKey,versão,cupom,rede]` | 0 | descartada 5 s após sair de uso |
| Pedido | `['orders',userId,id]` | 0 | polling de 5 s só sem tempo real |
| Perfil / carteiras / favoritos | `['me'|'wallets'|'favorites',userId]` | 30 s | favoritos com atualização otimista |

Retry: uma repetição automática para erros de rede/5xx (nunca para 4xx); mutações não repetem. Sem refetch ao focar a janela.

## Tempo real (Socket.IO)

- `features/realtime`: uma conexão por identidade (token/visitante), recriada ao entrar/sair. A biblioteca é carregada sob demanda, depois de o mock interceptar o `WebSocket`.
- Cada evento passa por: validação do envelope (zod) → descarte de id já visto (últimos 500) → descarte de versão antiga → isolamento (`order.updated` de outro usuário é ignorado) → aplicação nos caches.
- `nft.updated` corrige o NFT em todas as listas, no detalhe, nos destaques e nos favoritos, sem refazer requisições. Se o NFT está no carrinho, o carrinho é revalidado, a cotação fica desatualizada e o usuário é avisado.
- `order.updated` atualiza o pedido. Confirmado: carrinho e catálogo são revalidados.
- Reconexão (`realtime.resync` a partir da 2ª conexão): os recursos ativos voltam ao servidor, que é a fonte de verdade.
- `RealtimeStatusDot` mostra o estado (conectado/reconectando) e expõe `data-last-event-id` para os testes.

## Acessibilidade

- Um `h1` por página, títulos em ordem, landmarks (`banner`, `main`, `contentinfo`, `nav` nomeados), link "Pular para o conteúdo".
- Diálogos e drawers Radix: foco preso, Esc, foco devolvido ao gatilho; login foca o 1º campo.
- Formulários: rótulo associado (oculto quando o Figma não tem rótulo visível), `aria-invalid`, erro ligado por `aria-describedby`, foco no 1º campo inválido.
- Estados anunciados (`role="status"`/`alert`, `aria-live`), botões de ícone com `aria-label`, `aria-pressed` em favoritar e filtros, `aria-current` na navegação.
- Seleção de filtro e edição também têm pista não cromática (ícone de check, borda). Respeita `prefers-reduced-motion`.
- `@axe-core/playwright` sem violações sérias/críticas nas telas principais (spec 11).

## Performance

- **Portão da API** (`shared/api/api-gate.ts`): a interface renderiza imediatamente. O interceptor do Axios e o socket esperam a API ficar disponível; com mocks, isso acontece depois de o worker do MSW iniciar. A sessão salva só é lida nesse momento (`sessionStore.boot`).
- **Ordem de carregamento:** os parâmetros de controle dos mocks saem da URL antes de o router ler. O mock só começa a baixar depois que a primeira tela foi pintada (`useFirstScreenSignal`). O `tldts` do MSW foi trocado por uma versão mínima (mock de 179 KB para 66 KB gzip).
- **Sob demanda:** rotas (plugin do router), `socket.io-client`, toasts (`shared/lib/toast.ts`), tooltip, busca, lightbox e recibo.
- **Primeira tela:** shell estático no `index.html`; fontes self-host com preload e fallback de métricas; imagens AVIF/WebP com `srcset` e dimensões; prioridade alta na arte principal; altura do conteúdo reservada (CLS ≈ 0); `memo` nos cards.
- **Resultado:** desktop 99 de Performance. Mobile com mediana de 90 (Início) e 87 (Detalhe); o Detalhe é limitado pela cadeia até a resposta da API simulada (a arte do NFT é o LCP); análise em `docs/lighthouse/REPORT.md`. Accessibility 96–97, Best Practices 100, SEO 100.

## Testes

- Playwright em três projetos: desktop 1440, mobile 390 e tablet 768 (o tablet roda um subconjunto).
- Isolamento por teste com `?reset=1` e relógio controlado (`page.clock`).
- Eventos de tempo real disparados pelo servidor mock (`window.__kurio.emit`). Asserções conferidas também no banco do mock.
- Specs 00–14 cobrem os fluxos do enunciado. `visual.spec.ts` tem 12 baselines (4 telas × 3 tamanhos).

## Desvios do Figma e decisões de UX

- Telas sem frame (tablet, conta no mobile, estados de carregamento/erro/vazio, busca, drawer de filtros, revisão do pedido) seguem o mesmo padrão visual.
- Perfil e Carteiras não têm rodapé, como nos frames (também no mobile). Login, cadastro, carrinho e pagamento no mobile são telas cheias, sem rodapé, como nos frames.
- Checkout mobile em 3 etapas: o frame mobile só tem a etapa de carteira.
- "Contrato" e "Direitos autorais" do detalhe seguem o sentido correto (no Figma os textos estão trocados).
- A lista de edições mobile do Figma repete "1/10"; o app mostra as edições reais.
- Card do meio da 3ª linha sem nome/preço no Figma: implementado como os demais.
- Fundo dos modais: overlay translúcido (ink 85%).
- Demais itens na tabela de decisões acima (D11–D17).

## Limitações

- Backend simulado no navegador: dados por navegador (localStorage) e Socket.IO só via WebSocket, sem acks/rooms (ver `src/mocks/README.md`).
- Páginas fora do escopo (Criadores, Aprenda, ajuda, login social, newsletter, recuperação de senha, atividade, ofertas) avisam por toast, sem simular sucesso.
- Galeria do detalhe: as 4 vistas usam a mesma arte (o Figma só tem 4 artes no total).
