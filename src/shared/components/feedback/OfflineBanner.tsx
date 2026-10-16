import { useIsOffline } from '@/shared/hooks/useIsOffline'

export function OfflineBanner() {
  const offline = useIsOffline()
  return (
    <div role="status" aria-live="polite">
      {offline && (
        <p className="type-b-14-bold sticky top-0 z-50 bg-surface-dark px-6 py-3 text-center text-accent">
          Sem conexão — tentando reconectar…
        </p>
      )}
    </div>
  )
}
