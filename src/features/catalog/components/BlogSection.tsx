import { BLOG_POSTS } from '../lib/home-content'
import { BlogCard } from './BlogCard'

export function BlogSection() {
  return (
    <section aria-labelledby="blog-title" className="flex flex-col items-center gap-10">
      <div className="flex flex-col gap-3 text-center">
        <h2 id="blog-title" className="type-h-28 text-text-primary">
          Diário da Cunhagem
        </h2>
        <p className="type-b-14-normal text-text-secondary">
          Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
        </p>
      </div>
      <div className="-mx-6 flex w-[calc(100%+3rem)] snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 lg:mx-0 lg:w-full lg:overflow-visible lg:px-0 lg:pb-0">
        {BLOG_POSTS.map((post) => (
          <BlogCard key={post.title} post={post} />
        ))}
      </div>
    </section>
  )
}
