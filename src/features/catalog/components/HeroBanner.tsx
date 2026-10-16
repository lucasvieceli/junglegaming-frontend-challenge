import { Link } from '@tanstack/react-router'
import { useRef } from 'react'

import { CarouselDots } from '@/shared/components/media/CarouselDots'
import { NftImage } from '@/shared/components/media/NftImage'
import type { NftSummary } from '@/shared/contracts/nft'
import { markArtworkSource } from '@/shared/lib/artwork-transition'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'

import { useCarouselIndex } from '../hooks/useCarouselIndex'
import { heroSlide, heroSlideAnimation } from '../lib/hero-slides'
import { scrollToCatalog } from '../lib/scroll-to-catalog'

const CTA_CLASS = 'type-b-16-bold-20 w-[140px] pr-9 pl-7'

export function HeroBanner({ items }: { items: NftSummary[] }) {
  const artworkRef = useRef<HTMLDivElement>(null)
  const { index, setIndex, direction } = useCarouselIndex(items.length)
  const current = items[index]
  const slide = heroSlide(current, index, 'desktop')
  const Title = index === 0 ? 'h1' : 'h2'
  const animation = heroSlideAnimation(direction)

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Destaques"
      className="hidden h-[450px] items-center justify-between gap-10 overflow-hidden rounded-[24px] bg-surface-card pl-10 lg:flex"
    >
      <div className="flex max-w-[600px] flex-1 flex-col items-end gap-11">
        <div
          key={index}
          aria-live="polite"
          className={cn('flex h-[312px] w-full flex-col items-start gap-8', animation)}
        >
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-2 text-foreground">
              <p className="type-eyebrow">{slide.eyebrow}</p>
              <Title className="type-display-43">
                {slide.titleLines.map((line, lineIndex) => (
                  <span key={line} className="block">
                    {lineIndex > 0 && ' '}
                    {line}
                  </span>
                ))}
              </Title>
            </div>
            <p className="type-b-14-24 max-w-[557px] text-text-secondary">{slide.description}</p>
          </div>
          {slide.cta.nftId ? (
            <Button asChild className={CTA_CLASS}>
              <Link
                to="/nfts/$nftId"
                params={{ nftId: slide.cta.nftId }}
                viewTransition
                onClick={() => markArtworkSource(artworkRef.current)}
              >
                {slide.cta.label}
              </Link>
            </Button>
          ) : (
            <Button className={CTA_CLASS} onClick={scrollToCatalog}>
              {slide.cta.label}
            </Button>
          )}
        </div>
        {items.length > 1 && (
          <CarouselDots
            count={items.length}
            index={index}
            onSelect={setIndex}
            label="Escolher destaque"
          />
        )}
      </div>
      <div className="aspect-square w-[min(450px,40%)] shrink-0 overflow-hidden rounded-[24px]">
        {current ? (
          <div key={current.id} ref={artworkRef} className={cn('size-full', animation)}>
            <NftImage
              imageKey={current.imageKey}
              alt={current.name}
              sizes="450px"
              width={450}
              height={450}
              priority={index === 0}
            />
          </div>
        ) : (
          <Skeleton className="size-full rounded-none" />
        )}
      </div>
    </section>
  )
}
