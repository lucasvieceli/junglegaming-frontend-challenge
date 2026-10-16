import { NftImage } from '@/shared/components/media/NftImage'
import { notifyOutOfScope } from '@/shared/lib/out-of-scope'

import type { BLOG_POSTS } from '../lib/home-content'

export function BlogCard({ post }: { post: (typeof BLOG_POSTS)[number] }) {
  return (
    <article className="flex w-[268px] shrink-0 snap-start flex-col overflow-hidden rounded-lg bg-surface-card">
      <div className="h-[195px] overflow-hidden">
        <NftImage imageKey={post.imageKey} alt="" sizes="268px" width={268} height={195} />
      </div>
      <div className="flex flex-1 flex-col items-start gap-2 px-4 pt-3 pb-4">
        <p className="type-c-12-medium whitespace-pre-wrap text-text-secondary">{post.meta}</p>
        <h3 className="type-b-16-bold-normal text-text-primary">{post.title}</h3>
        <p className="type-c-12-medium text-text-secondary">{post.summary}</p>
        <button
          type="button"
          onClick={() => notifyOutOfScope('O artigo')}
          aria-label={`Ler mais: ${post.title}`}
          className="type-c-12-bold flex cursor-pointer gap-1 text-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-accent"
        >
          Ler mais{' '}
          <span aria-hidden="true" className="font-normal">
            →
          </span>
        </button>
      </div>
    </article>
  )
}
