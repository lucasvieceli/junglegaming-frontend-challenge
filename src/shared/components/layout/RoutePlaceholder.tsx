import { PageTitle } from './PageTitle'

export function RoutePlaceholder({ title }: { title: string }) {
  return (
    <div className="py-10">
      <PageTitle>{title}</PageTitle>
    </div>
  )
}
