# Backend simulado (MSW)

Toda a API REST e o tempo real (Socket.IO) do app são simulados **na camada de rede** com MSW. Componentes, hooks e o cliente Axios não conhecem os mocks; eles são iniciados por `src/main.tsx` antes do primeiro render quando `VITE_ENABLE_MOCKS=true` (padrão em dev, preview, testes e no deploy de demonstração).

## Como usar

| Ação                                         | Como                                                                                                             |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Escolher cenário                             | `?scenario=<nome>` na URL, painel "Cenários" (canto inferior esquerdo) ou `window.__kurio.setScenario('<nome>')` |
| Resetar tudo (DB, sessão, carrinho, cenário) | `?reset=1` ou botão "Resetar dados"                                                                              |
| Entrar direto como um usuário                | `?user=ana@kurio.test` ou botões do painel                                                                       |
| Ocultar o painel                             | `?panel=0` (usado nas capturas visuais)                                                                          |

Precedência do cenário: `?scenario=` > valor salvo (`localStorage['kurio.scenario']`) > `VITE_DEFAULT_SCENARIO`.

## Credenciais fictícias

| Usuário    | E-mail             | Senha        | Observação                                                                 |
| ---------- | ------------------ | ------------ | -------------------------------------------------------------------------- |
| Ana Sato   | `ana@kurio.test`   | `Kurio@2026` | carteira principal (Ethereum/MetaMask) e secundária (Polygon), 3 favoritos |
| Bruno Lima | `bruno@kurio.test` | `Kurio@2026` | sem carteiras nem favoritos                                                |

Cupons: `KURIO10` (10%), `LANCAMENTO5` (5%), `EXPIRADO20` (sempre expirado); qualquer outro é inválido.

## Cenários

| Nome                                | Efeito                                                                                                            |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `default`                           | Sucesso: latência 250 ms, pagamento confirmado em 4 s, carteira conecta em 1,5 s                                  |
| `empty-catalog`                     | Catálogo sem resultados                                                                                           |
| `slow-network`                      | 2,5 s em todas as respostas (skeletons)                                                                           |
| `variable-latency`                  | 100 ms–2 s com semente fixa (reproduzível)                                                                        |
| `out-of-order`                      | Respostas do catálogo chegam fora de ordem                                                                        |
| `offline`                           | Toda requisição falha com erro de rede; socket recusado                                                           |
| `server-error`                      | Catálogo/detalhe: 503 nas 2 primeiras tentativas, depois sucesso                                                  |
| `client-error`                      | Adicionar ao carrinho: 409 de disponibilidade                                                                     |
| `session-expired`                   | Sessões expiram 15 s após o login                                                                                 |
| `unauthorized`                      | Favoritos e pedidos: 403                                                                                          |
| `register-conflict`                 | Cadastro: 409 e-mail já usado                                                                                     |
| `validation-errors`                 | Perfil, carteiras e pedido: 422 com erros por campo                                                               |
| `coupon-invalid` / `coupon-expired` | Cupom sempre inválido / expirado                                                                                  |
| `price-changed-during-checkout`     | 3 s após a cotação do checkout, o 1º item sobe 10%                                                                |
| `edition-sold-out-during-checkout`  | 3 s após a cotação do checkout, o 1º item esgota                                                                  |
| `order-timeout-recover`             | Pedido criado na hora, 1ª resposta atrasa 12 s (timeout do cliente) → reenvio idempotente recupera o mesmo pedido |
| `payment-declined`                  | Pagamento recusado em 3 s                                                                                         |
| `payment-stuck-pending`             | Pedido fica pendente até ação manual                                                                              |
| `favorites-fail`                    | Favoritar/desfavoritar: 503 (rollback otimista)                                                                   |
| `wallet-connect-rejected`           | Carteira recusa a conexão                                                                                         |
| `wallet-disconnect`                 | Carteira desconecta 5 s após conectar                                                                             |
| `socket-drop`                       | Socket cai 2 s após criar o pedido (reconecta sozinho)                                                            |

Latência "aleatória" usa PRNG com semente fixa (reiniciada no reset) e o relógio é o `Date` da página (controlável pelo `page.clock` do Playwright).

## Estado e persistência

- DB em memória (`db/`), persistido em `localStorage['kurio.mockdb.v1']` (sobrevive a refresh). `?reset=1` restaura o seed integralmente.
- Datas das fixtures são relativas ao relógio no momento do seed (a aba "Novos lançamentos" sempre tem 12 itens).
- Senhas: SHA-256(salt + senha); nunca em claro.
- Toda mudança de preço/estoque passa por `applyNftChange` (muta o DB e então emite `nft.updated`): REST e eventos sempre concordam.
- Pedidos guardam a liquidação agendada (`settlement`) e são reagendados no boot: recarregar a página com um pedido pendente não o deixa preso.

## Tempo real (Socket.IO) e limitações do transporte

- O cliente usa `socket.io-client` com `transports: ['websocket']`. O MSW intercepta o WebSocket na **thread da página** (não no service worker) e o `@mswjs/socket.io-binding@0.2.0` traduz o protocolo Engine.IO/Socket.IO (`toSocketIo`).
- O `ws.link` usa só a origem (`VITE_SOCKET_URL`): o MSW 2.15 remove o prefixo `/socket.io/` e a query antes do match.
- Limitações: sem long-polling (só WebSocket); só namespace padrão e eventos de texto (sem acks, binário, rooms — o "room" por usuário é o registro de conexões); o binding anuncia ping de 25 s mas não envia PING, então o mock envia o frame `2` a cada 20 s; autenticação pela query da conexão (o `auth` do CONNECT não é exposto) e reafirmada com o evento `session.identify`; desconexão simulada fechando a conexão do lado do servidor (o cliente reconecta sozinho); `msw@3` não é suportado pelo binding (fixado `msw@~2.15`).
- Eventos: `nft.updated` (todos) e `order.updated` (só o dono), com envelope `{ id, type, resource, version, occurredAt, userId, payload }`; `realtime.resync` após cada conexão.

## API de controle (`window.__kurio`)

`setScenario`, `reset`, `loginAs`, `expireSession`, `emit(event, payload, { duplicateOf, version, deliverTo })`, `dropSocket`, `settleOrder`, `disconnectWallet`, `seedCart`, `getDb`, `setLatency`. Usada pelos testes E2E e pelo painel; os eventos sempre partem do servidor mock.
