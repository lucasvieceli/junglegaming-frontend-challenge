import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const ASSETS = path.join(ROOT, 'naosubir/design/figma/assets')
const OUT = path.join(ROOT, 'public/images/nfts')

if (!existsSync(ASSETS)) {
  console.error(`Figma assets not found at ${ASSETS}. They are kept outside the repository.`)
  process.exit(1)
}
const ARTWORKS = {
  'emerald-ape': '8f387',
  'sage-nomad': '83794',
  'ivory-baron': '9add2',
  'golden-beat': 'b7cfc',
}
const WIDTHS = [256, 512, 1024]

mkdirSync(OUT, { recursive: true })
for (const [slug, hash] of Object.entries(ARTWORKS)) {
  const source = sharp(path.join(ASSETS, `${hash}.png`))
  for (const width of WIDTHS) {
    const resized = source.clone().resize(width, width)
    await resized
      .clone()
      .avif({ quality: 55 })
      .toFile(path.join(OUT, `${slug}-${width}.avif`))
    await resized
      .clone()
      .webp({ quality: 80 })
      .toFile(path.join(OUT, `${slug}-${width}.webp`))
  }
  console.log(`✔ ${slug}`)
}
