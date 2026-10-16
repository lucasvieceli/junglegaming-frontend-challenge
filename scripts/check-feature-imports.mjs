import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const FEATURES = path.join(ROOT, 'src/features')

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : /\.tsx?$/.test(name) ? [full] : []
  })
}

if (!existsSync(FEATURES)) {
  console.log('✔ check-feature-imports: no features yet')
  process.exit(0)
}

const violations = []
for (const feature of readdirSync(FEATURES)) {
  const dir = path.join(FEATURES, feature)
  if (!statSync(dir).isDirectory()) continue
  for (const file of walk(dir)) {
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((text, i) => {
        const match = text.match(/from ['"]@\/features\/([^/'"]+)/)
        if (match && match[1] !== feature)
          violations.push(`${path.relative(ROOT, file)}:${i + 1}  ${text.trim()}`)
      })
  }
}

if (violations.length) {
  console.error(violations.join('\n'))
  console.error(`\n✖ ${violations.length} cross-feature import(s). Move shared code to src/shared.`)
  process.exit(1)
}
console.log('✔ check-feature-imports: no feature imports another')
