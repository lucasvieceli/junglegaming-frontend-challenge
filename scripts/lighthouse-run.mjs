import { spawnSync } from 'node:child_process'
import { rmSync } from 'node:fs'

for (const profile of ['mobile', 'desktop']) {
  rmSync(`reports/lighthouse/${profile}`, { recursive: true, force: true })
  console.log(`\n▶ Lighthouse ${profile}`)
  const run = spawnSync('npx', ['lhci', 'autorun', `--config=lighthouserc.${profile}.json`], {
    stdio: 'inherit',
  })
  if (run.status !== 0) console.warn(`⚠ lhci (${profile}) exited with code ${run.status}`)
}

const report = spawnSync('node', ['scripts/lighthouse-report.mjs'], { stdio: 'inherit' })
process.exit(report.status ?? 1)
