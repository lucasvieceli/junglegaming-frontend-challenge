import { useRouter, type ErrorComponentProps } from '@tanstack/react-router'

import { ErrorState } from './ErrorState'

export function RouteErrorPage({ reset }: ErrorComponentProps) {
  const router = useRouter()
  return (
    <ErrorState
      title="Algo deu errado"
      message="Não foi possível exibir esta página. Verifique sua conexão e tente novamente."
      onRetry={() => {
        reset()
        void router.invalidate()
      }}
      className="min-h-[60vh]"
    />
  )
}
