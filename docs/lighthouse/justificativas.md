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
