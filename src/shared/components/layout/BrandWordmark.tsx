import { Link } from '@tanstack/react-router'

export function BrandWordmark() {
  return (
    <Link
      to="/"
      aria-label="Kurio — página inicial"
      className="type-wordmark flex h-[34.3px] w-40 shrink-0 items-start pt-[8.15px] text-foreground"
    >
      KURIO
    </Link>
  )
}
