import { Link } from '@tanstack/react-router'

import { ArrowDownLongIcon } from '@/shared/components/icons/ArrowDownLongIcon'
import { NftImage } from '@/shared/components/media/NftImage'
import { cn } from '@/shared/lib/cn'

import type { PROMOS } from '../lib/home-content'

export function PromoCard({ promo }: { promo: (typeof PROMOS)[number] }) {
  return (
    <article className="relative flex min-h-[250px] overflow-hidden rounded-lg bg-surface-card lg:h-[250px]">
      <div className="relative -ml-[5px] w-[40%] shrink-0 overflow-hidden rounded-[18px] lg:w-[292px]">
        <NftImage
          imageKey={promo.imageKey}
          alt=""
          sizes="(min-width: 1024px) 292px, 40vw"
          width={292}
          height={250}
        />
      </div>
      <div
        className={cn(
          'relative flex flex-1 flex-col items-end gap-3 py-8 pr-[30px] pl-4 text-right lg:gap-[9px] lg:pt-[37px] lg:pb-0',
          promo.layout.right,
        )}
      >
        <h3 className="type-b-18-bold-24 text-foreground lg:whitespace-nowrap">
          {promo.title[0]}
          <br />
          {promo.title[1]}
        </h3>
        <p className={cn('type-b-14-24 max-w-[263px] text-text-secondary', promo.layout.textWidth)}>
          {promo.text}
        </p>
        <Link
          to="/"
          search={promo.search}
          hash="catalog"
          className="type-b-14-medium-20 mt-auto flex h-10 w-[140px] lg:absolute lg:top-[164px] lg:mt-0 items-center justify-center gap-2 rounded-md bg-primary text-ink outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent"
        >
          Explorar
          <ArrowDownLongIcon aria-hidden="true" className="h-[12.75px] w-[10.5px] -rotate-90" />
        </Link>
      </div>
      <img
        src="/images/decor/promo-rings.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover object-left-bottom"
      />
    </article>
  )
}
