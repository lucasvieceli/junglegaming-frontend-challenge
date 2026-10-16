# Auditoria Lighthouse

Gerado por `scripts/lighthouse-report.mjs` em 2026-10-16T00:00:46.123Z. Valores = **mediana de 3 execuções** por página e perfil.

| Página | Perfil | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT | Execuções | Relatório |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Início | mobile | 90 | 97 | 100 | 100 | 3.55 s | 0.002 | 85 ms | 3 | [HTML](../../reports/lighthouse/mobile/-2026_10_15_23_57_26.html) |
| Detalhe do NFT | mobile | 87 | 96 | 100 | 100 | 3.85 s | 0.000 | 104 ms | 3 | [HTML](../../reports/lighthouse/mobile/nfts_nft_emerald_ape_042-2026_10_15_23_58_05.html) |
| Início | desktop | 99 | 97 | 100 | 100 | 0.92 s | 0.003 | 0 ms | 3 | [HTML](../../reports/lighthouse/desktop/-2026_10_15_23_59_20.html) |
| Detalhe do NFT | desktop | 99 | 97 | 100 | 100 | 0.86 s | 0.000 | 0 ms | 3 | [HTML](../../reports/lighthouse/desktop/nfts_nft_emerald_ape_042-2026_10_15_23_59_47.html) |

Metas: Performance ≥ 90 · Accessibility ≥ 95 · Best Practices ≥ 95 · SEO ≥ 90.

## Condições de execução

- Build otimizado (`npm run build` + `vite preview`), cenário de mocks `default` (MSW e socket ativos, painel de cenários presente).
- Lighthouse 12.6.1 via @lhci/cli 0.15.1, Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/155.0.0.0 Safari/537.36.
- Perfil mobile: emulação padrão do Lighthouse (throttling simulado {"rttMs":150,"throughputKbps":1638.4,"requestLatencyMs":562.5,"downloadThroughputKbps":1474.5600000000002,"uploadThroughputKbps":675,"cpuSlowdownMultiplier":4}). Perfil desktop: `preset: desktop`.
- Máquina: Darwin 27.0.0 · Apple M1 · Node v22.19.0.
- Relatórios HTML/JSON completos em `reports/lighthouse/{mobile,desktop}`.

## Justificativas

### Performance

**Onde:** só o Detalhe do NFT no perfil mobile, com mediana 87 (execuções individuais de 86 a 88). A Início mobile fica em 90 e o desktop em 99 nas duas páginas. Accessibility 96–97 (a única auditoria abaixo de 100 é `target-size`: os pontos de 12 px dos carrosséis, na medida do Figma), Best Practices 100 e SEO 100 nos dois perfis. CLS ≈ 0 e TBT ≈ 100 ms ou menos em todos os casos.

**Causa (audit "Largest Contentful Paint", fase "Load Delay" ≈ 80% do LCP do Detalhe):** o elemento de LCP é a arte do NFT, e a URL dela só é conhecida quando a API responde. No projeto, a API é o backend simulado com MSW exigido pelo enunciado, então a imagem espera uma cadeia: JavaScript do app → chunk da rota → worker do MSW (que só liga depois da primeira pintura) → resposta da API (o cenário padrão simula 250 ms de latência) → download da imagem. O perfil mobile do Lighthouse simula 4G lento (1,6 Mbps, RTT 150 ms) e CPU 4× mais lenta, o que alonga cada etapa.

**O que foi feito (medido a cada passo):**

| Medida | Efeito |
| --- | --- |
| Portão da API: a interface renderiza sem esperar o mock; só as requisições esperam o worker do MSW | FCP e LCP da Início não dependem mais do mock |
| O mock só começa a baixar depois que a primeira tela foi pintada (`onRendered` do router) | não disputa banda nem CPU com a primeira tela |
| `tldts` (lista de sufixos públicos que o MSW traz para cookies, ~250 KB) trocado por uma versão mínima | mock de 179 KB para 66 KB gzip |
| Toasts (`sonner`), tooltip/floating-ui, busca, lightbox e recibo carregados sob demanda | bundle inicial de 120 KB para 100 KB gzip |
| Chunks comuns pequenos embutidos nos arquivos que os usam (`codeSplitting.experimentalInlineCommonChunks` do Rolldown) | Início de 70 para 31 requisições; mobile de 83 para 90 (Início) e de 82 para 87 (Detalhe) |
| Shell estático no `index.html` (fundo e marca) | primeiro paint antes do JavaScript |
| Fontes self-host com preload; imagens AVIF/WebP com `srcset` e dimensões; preload do fundo do hero | sem bloqueio de fontes; CLS ≈ 0 |
| Altura do conteúdo reservada | CLS do detalhe de 0,30 para 0 |
| `memo` nos cards e code-split por rota | menos trabalho de render |

Também foram medidas e descartadas, por não melhorarem o Detalhe ou piorarem a Início: baixar o mock em paralelo desde o início, incluir a rota de detalhe no pacote principal e ligar o mock na pintura do layout.

**Por que o Detalhe mobile não chega a 90:**

- **O que resta é a cadeia até a resposta da API simulada.** A alternativa seria pré-renderizar o HTML do detalhe no build (SSG/SSR), uma mudança de arquitetura que não foi adotada nesta entrega (SPA com Vite).
- **Opções que distorceriam a medição:**
  - Desligar o mock ou reduzir a latência do cenário padrão só para medir.
  - Renderizar a arte do Detalhe antes de a API responder.
  - Trocar o React por outra biblioteca.
- **Por que essas opções não foram usadas:** o enunciado pede a auditoria "sem simplificações exclusivas para melhorar a pontuação". Por isso a medição foi feita com o build e o backend simulado entregues.
- **Com um backend real:** os 66 KB do mock e a espera pelo worker saem do caminho. O Detalhe passaria a depender só da latência da API.

