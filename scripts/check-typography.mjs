import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'src')
const FORBIDDEN = /\b(text-\[|leading-\[|tracking-\[|font-\[)/
const SKIP = [path.join(SRC, 'styles'), path.join(SRC, 'routeTree.gen.ts')]

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (SKIP.some((s) => full.startsWith(s))) return []
    return statSync(full).isDirectory() ? walk(full) : /\.(tsx?|css)$/.test(name) ? [full] : []
  })
}

const violations = walk(SRC).flatMap((file) =>
  readFileSync(file, 'utf8')
    .split('\n')
    .map((line, i) => ({ file, line: i + 1, text: line }))
    .filter(({ text }) => FORBIDDEN.test(text)),
)

if (violations.length) {
  for (const v of violations)
    console.error(`${path.relative(ROOT, v.file)}:${v.line}  ${v.text.trim()}`)
  console.error(
    `\n✖ ${violations.length} arbitrary typography usage(s). Use the type-* utilities from src/styles/typography.css.`,
  )
  process.exit(1)
}
console.log('✔ check-typography: no arbitrary typography')
