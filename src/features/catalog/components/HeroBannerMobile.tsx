import { Link } from '@tanstack/react-router'
import { useRef } from 'react'

import { ArrowDownLongIcon } from '@/shared/components/icons/ArrowDownLongIcon'
import { CarouselDots } from '@/shared/components/media/CarouselDots'
import type { NftSummary } from '@/shared/contracts/nft'
import { markArtworkSource } from '@/shared/lib/artwork-transition'
import { cn } from '@/shared/lib/cn'

import { useCarouselIndex } from '../hooks/useCarouselIndex'
import { heroSlide, heroSlideAnimation } from '../lib/hero-slides'
import { scrollToCatalog } from '../lib/scroll-to-catalog'
import { HeroMobileArt } from './HeroMobileArt'

const CTA_CLASS =
  'type-c-12-bold flex h-4 cursor-pointer items-center gap-2 text-accent outline-none focus-visible:ring-2 focus-visible:ring-accent'

export function HeroBannerMobile({ items }: { items: NftSummary[] }) {
  const artworkRef = useRef<HTMLDivElement>(null)
  const { index, setIndex, direction } = useCarouselIndex(items.length)
  const current = items[index]
  const next = items[(index + 1) % items.length]
  const slide = heroSlide(current, index, 'mobile')
  const Title = index === 0 ? 'h1' : 'h2'
  const animation = heroSlideAnimation(direction)
  const ctaContent = (
    <>
      {slide.cta.label}
      <ArrowDownLongIcon className="h-[11.5px] w-[9.5px] -rotate-90 text-primary" />
    </>
  )

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Destaques"
      className="relative flex h-[190px] flex-col items-center justify-center overflow-hidden rounded-[30px] p-4 lg:hidden"
    >
      <img
        src="/images/decor/hero-mobile.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="relative flex w-full flex-col items-center gap-4">
        <div className="flex h-[156px] w-full items-center gap-2">
          <div
            key={index}
            aria-live="polite"
            className={cn('flex min-w-0 flex-1 flex-col items-start', animation)}
          >
            <div className="flex flex-col gap-1.5">
              <p className="type-c-12-medium truncate text-foreground">{slide.eyebrow}</p>
              <Title className="type-t-18-bold line-clamp-2 max-w-[190px] text-foreground">
                {slide.titleLines.join(' ')}
              </Title>
              <p className="type-c-12-18 line-clamp-3 text-text-secondary">{slide.description}</p>
            </div>
            {slide.cta.nftId ? (
              <Link
                to="/nfts/$nftId"
                params={{ nftId: slide.cta.nftId }}
                viewTransition
                onClick={() => markArtworkSource(artworkRef.current)}
                className={CTA_CLASS}
              >
                {ctaContent}
              </Link>
            ) : (
              <button type="button" onClick={scrollToCatalog} className={CTA_CLASS}>
                {ctaContent}
              </button>
            )}
          </div>
          <HeroMobileArt
            artworkRef={artworkRef}
            key={current?.id}
            current={current}
            next={next}
            priority={index === 0}
            className={animation}
          />
        </div>
        {items.length > 1 && (
          <CarouselDots
            count={items.length}
            index={index}
            onSelect={setIndex}
            size="sm"
            label="Escolher destaque"
          />
        )}
      </div>
    </section>
  )
}
