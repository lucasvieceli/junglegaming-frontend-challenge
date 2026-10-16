import type { Review } from '@/shared/contracts/nft'
import { formatShortDate } from '@/shared/lib/format-date'

import { RatingStars } from './RatingStars'

export function ReviewItem({ review }: { review: Review }) {
  return (
    <article className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="type-b-15-bold text-foreground">{review.author}</h3>
        <RatingStars value={review.stars} />
        <time dateTime={review.date} className="type-c-12 text-text-secondary">
          {formatShortDate(review.date)}
        </time>
      </div>
      <p className="type-b-14-24 text-text-secondary">{review.text}</p>
    </article>
  )
}
