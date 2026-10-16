import { lazy, Suspense, type ComponentProps } from 'react'

const NftLightbox = lazy(() =>
  import('./NftLightbox').then((module) => ({ default: module.NftLightbox })),
)

export function LazyNftLightbox(props: ComponentProps<typeof NftLightbox>) {
  if (!props.open) return null
  return (
    <Suspense fallback={null}>
      <NftLightbox {...props} />
    </Suspense>
  )
}
