import { Link } from '@tanstack/react-router'

import { Button } from '@/shared/ui/button'

import { EmptyState } from './EmptyState'

export function NotFoundPage({
  title = 'Página não encontrada',
  description = 'O endereço que você acessou não existe ou foi removido.',
}: {
  title?: string
  description?: string
}) {
  return (
    <EmptyState
      as="h1"
      title={title}
      description={description}
      className="min-h-[60vh]"
      action={
        <Button asChild className="type-b-16-bold-20">
          <Link to="/">Voltar ao início</Link>
        </Button>
      }
    />
  )
}
