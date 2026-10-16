import { FooterBrandBand } from './FooterBrandBand'
import { FooterFeaturesBand } from './FooterFeaturesBand'
import { FooterLinksBand } from './FooterLinksBand'

export function SiteFooter() {
  return (
    <footer className="flex flex-col">
      <FooterFeaturesBand />
      <FooterBrandBand />
      <FooterLinksBand />
      <p className="type-b-14-30 mt-1.5 text-center text-foreground">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </footer>
  )
}
