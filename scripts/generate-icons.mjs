import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const ASSETS = path.join(ROOT, 'naosubir/design/figma/assets')
const OUT = path.join(ROOT, 'src/shared/components/icons')

if (!existsSync(ASSETS)) {
  console.error(`Figma assets not found at ${ASSETS}. They are kept outside the repository.`)
  process.exit(1)
}

const ICONS = {
  CloseIcon: ['339b7', 'mono'],
  SearchIcon: ['bd8c9', 'mono'],
  SearchMobileIcon: ['ce4db', 'mono'],
  CartIcon: ['c0c08', 'mono'],
  LogoutIcon: ['62554', 'mono'],
  ChevronDownIcon: ['61106', 'mono'],
  ChevronDownSmallIcon: ['7e373', 'mono'],
  ChevronDownThinIcon: ['0e8e8', 'mono'],
  CurvedChevronIcon: ['90c5a', 'mono'],
  ArrowDownLongIcon: ['e0393', 'mono'],
  TrashIcon: ['e196c', 'mono'],
  StarIcon: ['19a5f', 'mono'],
  MinusIcon: ['4453a', 'mono'],
  PlusIcon: ['f8641', 'mono'],
  EyeOffIcon: ['5cb53', 'mono'],
  ZoomIcon: ['9ae7b', 'multi'],
  FilterIcon: ['bc3bf', 'mono'],
  UserIcon: ['55e96', 'mono'],
  LocationIcon: ['8a4e9', 'mono'],
  ShoppingIcon: ['0586d', 'mono'],
  HeartIcon: ['d427d', 'mono'],
  HeartSmallIcon: ['e84fc', 'mono'],
  HeartTabIcon: ['c40be', 'mono'],
  ActivityIcon: ['83e14', 'mono'],
  DownloadIcon: ['65d5d', 'mono'],
  DangerIcon: ['8d6ff', 'mono'],
  ImageIcon: ['19cc8', 'mono'],
  WalletIcon: ['75870', 'mono'],
  KebabIcon: ['a616c', 'mono'],
  HomeIcon: ['b096d', 'mono'],
  ShopIcon: ['352b3', 'mono'],
  UserTabIcon: ['99dca', 'mono'],
  ShareLinkedinIcon: ['a4abe', 'mono'],
  ShareMessageIcon: ['bec29', 'mono'],
  ShareTwitterIcon: ['fbcbd', 'mono'],
  SocialFacebookIcon: ['99280', 'mono'],
  SocialInstagramIcon: ['d48dd', 'mono'],
  SocialTwitterIcon: ['b4111', 'mono'],
  SocialLinkedinIcon: ['b8b84', 'mono'],
  SocialYoutubeIcon: ['ca2da', 'mono'],
  FacebookLogo: ['5561e', 'multi'],
  ThankYouIllustration: ['21283', 'mono'],
}

const ATTR_RENAMES = {
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-opacity': 'strokeOpacity',
  'fill-opacity': 'fillOpacity',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'xlink:href': 'href',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'mask-type': 'maskType',
  'flood-opacity': 'floodOpacity',
}
const WHITE = /^(white|#fff|#ffffff)$/i

function toJsx(svg, mode, prefix) {
  const open = svg.match(/<svg([^>]*)>/)
  if (!open) throw new Error('invalid svg')
  const attr = (name) => open[1].match(new RegExp(`\\s${name}="([^"]+)"`))?.[1]
  const [width, height, viewBox] = [attr('width'), attr('height'), attr('viewBox')]
  let body = svg.slice(open.index + open[0].length, svg.lastIndexOf('</svg>')).trim()

  body = body.replace(/\s(id)="([^"]+)"/g, (_m, _a, v) =>
    /^(paint|clip|mask|filter)/.test(v) ? ` id="${prefix}-${v}"` : '',
  )
  body = body.replace(/url\(#([^)]+)\)/g, (_m, v) => `url(#${prefix}-${v})`)
  body = body.replace(/\sstyle="([^"]*)"/g, (_m, css) => {
    const entries = css
      .split(';')
      .filter(Boolean)
      .map((decl) => {
        const [k, v] = decl.split(':').map((x) => x.trim())
        return `${k.replace(/-([a-z])/g, (_x, c) => c.toUpperCase())}: '${v}'`
      })
    return ` style={{ ${entries.join(', ')} }}`
  })
  body = body.replace(/\s([a-z]+(?:-[a-z]+)+|xlink:href)=/g, (m, a) =>
    ATTR_RENAMES[a] ? ` ${ATTR_RENAMES[a]}=` : m,
  )

  if (mode === 'mono') {
    const colors = new Set(
      [...body.matchAll(/(?:fill|stroke|stopColor)="(#[0-9a-fA-F]{3,8}|black)"/g)].map((m) =>
        m[1].toLowerCase(),
      ),
    )
    const nonWhite = [...colors].filter((c) => !WHITE.test(c))
    if (nonWhite.length > 1)
      throw new Error(`${prefix}: more than one color (${nonWhite.join(', ')}); use 'multi'`)
    for (const c of nonWhite) body = body.replace(new RegExp(`="${c}"`, 'gi'), '="currentColor"')
  }
  return { width, height, viewBox, body }
}

const COMPOSITES = {
  ScanIcon: {
    width: 26.8227,
    height: 24,
    mode: 'mono',
    parts: [
      ['ca931', 1.3, 0],
      ['97351', 15.1, 0.08],
      ['f7581', 1.3, 13.7],
      ['db42b', 15.1, 13.7],
      ['d5458', 0, 11.1],
    ],
  },
  GoogleLogo: {
    width: 20,
    height: 20,
    mode: 'multi',
    parts: [
      ['88a3c', 1.422, 11.536],
      ['75804', 10, 14.266],
      ['a3c98', 0, 4.938],
      ['1c266', 9.414, 7.656],
      ['1174b', 10, 7.656],
      ['5f1dc', 1.422, 0],
      ['e1073', 10, 0],
    ],
  },
}

mkdirSync(OUT, { recursive: true })
for (const [name, [hash, mode]] of Object.entries(ICONS)) {
  const svg = readFileSync(path.join(ASSETS, `${hash}.svg`), 'utf8')
  const { width, height, viewBox, body } = toJsx(svg, mode, hash)
  const file = `import type { SVGProps } from 'react'

export function ${name}(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="${width}"
      height="${height}"
      viewBox="${viewBox}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      ${body.replace(/\n/g, '\n      ')}
    </svg>
  )
}
`
  writeFileSync(path.join(OUT, `${name}.tsx`), file)
}
for (const [name, spec] of Object.entries(COMPOSITES)) {
  const groups = spec.parts.map(([hash, x, y]) => {
    const svg = readFileSync(path.join(ASSETS, `${hash}.svg`), 'utf8')
    const { body } = toJsx(svg, spec.mode, hash)
    return `<g transform="translate(${x} ${y})">${body}</g>`
  })
  const file = `import type { SVGProps } from 'react'

export function ${name}(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="${spec.width}"
      height="${spec.height}"
      viewBox="0 0 ${spec.width} ${spec.height}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      ${groups.join('\n      ')}
    </svg>
  )
}
`
  writeFileSync(path.join(OUT, `${name}.tsx`), file)
}

console.log(
  `${Object.keys(ICONS).length + Object.keys(COMPOSITES).length} icons generated in ${path.relative(ROOT, OUT)}`,
)
