import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const TARGETS = { performance: 90, accessibility: 95, 'best-practices': 95, seo: 90 }
const LABELS = {
  performance: 'Performance',
  accessibility: 'Accessibility',
  'best-practices': 'Best Practices',
  seo: 'SEO',
}
const JUSTIFICATIONS = 'docs/lighthouse/justificativas.md'

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}
const pageName = (url) => (new URL(url).pathname === '/' ? 'Início' : 'Detalhe do NFT')

function collect(profile) {
  const manifestPath = path.join('reports/lighthouse', profile, 'manifest.json')
  if (!existsSync(manifestPath)) return []
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const byUrl = new Map()
  for (const entry of manifest) {
    const lhr = JSON.parse(readFileSync(entry.jsonPath, 'utf8'))
    const runs = byUrl.get(entry.url) ?? []
    runs.push({ entry, lhr })
    byUrl.set(entry.url, runs)
  }
  return [...byUrl.entries()].map(([url, runs]) => {
    const scores = Object.fromEntries(
      Object.keys(TARGETS).map((cat) => [
        cat,
        Math.round(median(runs.map((r) => r.lhr.categories[cat].score * 100))),
      ]),
    )
    const metric = (id) => median(runs.map((r) => r.lhr.audits[id].numericValue))
    const representative = runs.find((r) => r.entry.isRepresentativeRun) ?? runs[0]
    return {
      profile,
      url,
      page: pageName(url),
      scores,
      lcp: metric('largest-contentful-paint'),
      cls: metric('cumulative-layout-shift'),
      tbt: metric('total-blocking-time'),
      runs: runs.length,
      html: path.relative('docs/lighthouse', representative.entry.htmlPath),
      lhr: representative.lhr,
    }
  })
}

const results = [...collect('mobile'), ...collect('desktop')]
if (!results.length) {
  console.error('No results in reports/lighthouse/*/manifest.json. Run `npm run lighthouse`.')
  process.exit(1)
}

const LHCI_VERSION = JSON.parse(
  readFileSync(new URL('../node_modules/@lhci/cli/package.json', import.meta.url), 'utf8'),
).version
const justifications = existsSync(JUSTIFICATIONS) ? readFileSync(JUSTIFICATIONS, 'utf8') : ''
const failing = results.flatMap((r) =>
  Object.entries(TARGETS)
    .filter(([cat, target]) => r.scores[cat] < target)
    .map(([cat]) => ({ ...r, cat })),
)
const unjustified = failing.filter((f) => !justifications.includes(`## ${LABELS[f.cat]}`))

const sample = results[0].lhr
const rows = results
  .map(
    (r) =>
      `| ${r.page} | ${r.profile} | ${Object.keys(TARGETS)
        .map((c) => r.scores[c])
        .join(
          ' | ',
        )} | ${(r.lcp / 1000).toFixed(2)} s | ${r.cls.toFixed(3)} | ${Math.round(r.tbt)} ms | ${r.runs} | [HTML](${r.html}) |`,
  )
  .join('\n')

const md = `# Auditoria Lighthouse

Gerado por \`scripts/lighthouse-report.mjs\` em ${new Date().toISOString()}. Valores = **mediana de ${results[0].runs} execuções** por página e perfil.

| Página | Perfil | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT | Execuções | Relatório |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
${rows}

Metas: Performance ≥ 90 · Accessibility ≥ 95 · Best Practices ≥ 95 · SEO ≥ 90.

## Condições de execução

- Build otimizado (\`npm run build\` + \`vite preview\`), cenário de mocks \`default\` (MSW e socket ativos, painel de cenários presente).
- Lighthouse ${sample.lighthouseVersion} via @lhci/cli ${LHCI_VERSION}, ${sample.environment?.hostUserAgent ?? 'Chrome headless'}.
- Perfil mobile: emulação padrão do Lighthouse (throttling simulado ${JSON.stringify(sample.configSettings?.throttling ?? {})}). Perfil desktop: \`preset: desktop\`.
- Máquina: ${os.type()} ${os.release()} · ${os.cpus()[0]?.model ?? 'CPU'} · Node ${process.version}.
- Relatórios HTML/JSON completos em \`reports/lighthouse/{mobile,desktop}\`.

## Justificativas

${failing.length ? justifications || '_(pendente)_' : 'Todas as metas foram atingidas.'}
`

mkdirSync('docs/lighthouse', { recursive: true })
writeFileSync('docs/lighthouse/REPORT.md', md)
console.log('✔ docs/lighthouse/REPORT.md generated')
if (unjustified.length) {
  for (const f of unjustified)
    console.error(
      `✖ ${f.page} (${f.profile}): ${LABELS[f.cat]} ${f.scores[f.cat]} < ${TARGETS[f.cat]} without justification in ${JUSTIFICATIONS}`,
    )
  process.exit(1)
}
