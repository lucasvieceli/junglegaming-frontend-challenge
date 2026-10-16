# Kurio — Marketplace de NFTs

Desafio frontend da Jungle Gaming: marketplace de NFTs em React + TypeScript, fiel ao Figma, com catálogo, detalhe, favoritos, carrinho, checkout com carteira, pedido com confirmação em tempo real, login/cadastro, perfil e carteiras. Toda a API (REST e Socket.IO) é simulada no navegador com MSW, inclusive na versão publicada.

**Deploy:** https://junglegaming-frontend-challenge.vercel.app

## Requisitos

- Node 22 ou superior
- npm 10 ou superior

## Como rodar

```bash
npm ci
npm run dev        # http://localhost:5173
```

Build de produção local:

```bash
npm run build
npm run preview    # http://localhost:4173
```

## Variáveis de ambiente

Copie `.env.example` para `.env` (opcional: os valores padrão já funcionam).

| Variável | Padrão | Para que serve |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | Base das chamadas REST (o MSW intercepta) |
| `VITE_SOCKET_URL` | `wss://realtime.kurio.local` | Host fictício do Socket.IO (o MSW intercepta) |
| `VITE_ENABLE_MOCKS` | `true` | Liga o backend simulado |
| `VITE_DEFAULT_SCENARIO` | `default` | Cenário inicial dos mocks |
| `VITE_APP_URL` | `http://localhost:4173` | URL pública |

## Credenciais fictícias

| Usuário | E-mail | Senha |
| --- | --- | --- |
| Ana Sato (com carteiras e favoritos) | `ana@kurio.test` | `Kurio@2026` |
| Bruno Lima (sem carteiras) | `bruno@kurio.test` | `Kurio@2026` |

Cupons: `KURIO10` (10%), `LANCAMENTO5` (5%), `EXPIRADO20` (expirado). Qualquer outro código é inválido.

## Cenários do backend simulado

- `?scenario=<nome>` na URL troca o cenário.
- `?reset=1` restaura todos os dados (catálogo, carrinhos, pedidos, sessão).
- `?user=ana@kurio.test` entra direto como um usuário.
- O painel "Cenários", no canto inferior esquerdo, faz o mesmo e dispara eventos de tempo real.
- No console, `window.__kurio` expõe a mesma API de controle usada pelos testes.

A tabela completa de cenários está em [`src/mocks/README.md`](src/mocks/README.md).

### Como reproduzir cada falha

| Situação | Passo a passo |
| --- | --- |
| Sessão expirada | `/?scenario=session-expired&user=ana@kurio.test`, vá ao checkout e espere 20 s: aviso, login e volta ao checkout com o rascunho preservado |
| Cupom inválido/expirado | No carrinho, aplique `XYZ` ou `EXPIRADO20` |
| Preço alterado em tempo real | Com um item no carrinho, use o botão "Preço +10% (1º item do carrinho)" do painel, ou `?scenario=price-changed-during-checkout` no checkout |
| Item esgotado no checkout | `?scenario=edition-sold-out-during-checkout` e abra o pagamento |
| Timeout do pedido | `?scenario=order-timeout-recover`: o reenvio usa a mesma chave e chega ao mesmo pedido |
| Pagamento recusado | `?scenario=payment-declined` e conclua uma compra |
| Carteira recusada | `?scenario=wallet-connect-rejected` e clique em "Conectar carteira" |
| Sem conexão | `?scenario=offline` |
| Erro do servidor | `?scenario=server-error` (as duas primeiras respostas do catálogo/detalhe são 503) |
| Rede lenta | `?scenario=slow-network` (esqueletos com as dimensões finais) |

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm run preview` | Build de produção e servidor local dele |
| `npm run typecheck` | TypeScript em todo o projeto (app, configs e E2E) |
| `npm run lint` | ESLint sem avisos + verificação de tipografia (só utilitários do Figma) + verificação de imports entre features |
| `npm run test:e2e` | Playwright em desktop (1440), mobile (390) e tablet (768) |
| `npm run test:e2e:update-snapshots` | Atualiza as baselines visuais (só depois de uma mudança visual intencional, revisando o diff) |
| `npm run lighthouse` | Build + Lighthouse mobile e desktop + relatório em `docs/lighthouse/REPORT.md` |
| `npm run check` | typecheck + lint + E2E |

## Testes e relatórios

- Specs em `e2e/specs` (00 a 14 + regressão visual), um por fluxo do enunciado. Page objects em `e2e/pages`.
- Baselines visuais em `e2e/specs/__screenshots__/<plataforma>/<projeto>/`. As versionadas são de macOS (`darwin`); a renderização de fontes muda entre sistemas, então em Linux/CI gere as baselines da plataforma uma vez com `npm run test:e2e:update-snapshots` antes de rodar a suíte.
- Relatório HTML do Playwright (com traces das falhas): `reports/playwright/`, aberto por `npm run test:e2e:report`.
- Lighthouse: `docs/lighthouse/REPORT.md` (medianas de 3 execuções) e relatórios completos em `reports/lighthouse/`.

## Estrutura

```
src/
  app/        providers, router, guardas de rota, casca do app e composições entre features
  routes/     rotas (só definem params, guardas e qual página renderizar)
  features/   catálogo, nft, auth, favoritos, carrinho, checkout, pedidos, tempo real, perfil, carteiras
  shared/     contratos (zod), cliente HTTP, sessão, utilitários, componentes e primitivos de UI
  mocks/      backend simulado: banco, handlers REST, Socket.IO, cenários, painel
e2e/          fixtures, page objects e specs do Playwright
docs/         relatório e justificativas do Lighthouse
```

Decisões, arquitetura, desvios do Figma e limitações: [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Deploy (Vercel)

`vercel.json` já configura o fallback de SPA e o cache dos arquivos estáticos. No projeto Vercel: framework Vite, build `npm run build`, saída `dist`, Node 22 e as variáveis acima (com `VITE_APP_URL` apontando para a URL publicada).

Checklist depois do deploy:

1. Abrir `/`, `/nfts/nft_emerald_ape_042`, `/cart` e `/account/profile` (este deve pedir login) e recarregar cada uma.
2. Abrir `?scenario=slow-network` e ver os esqueletos.
3. Entrar com Ana e fazer uma compra completa até o recibo.
4. Abrir `?reset=1` e confirmar que os dados voltam ao início.
5. Conferir o console sem erros.
