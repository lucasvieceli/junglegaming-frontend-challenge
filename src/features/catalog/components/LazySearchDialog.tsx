import { lazy, Suspense, type ComponentProps } from 'react'

const SearchDialog = lazy(() =>
  import('./SearchDialog').then((module) => ({ default: module.SearchDialog })),
)

export function LazySearchDialog(props: ComponentProps<typeof SearchDialog>) {
  if (!props.open) return null
  return (
    <Suspense fallback={null}>
      <SearchDialog {...props} />
    </Suspense>
  )
}
