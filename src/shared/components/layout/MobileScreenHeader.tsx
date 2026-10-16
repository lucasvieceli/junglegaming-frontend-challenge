import { useCanGoBack, useRouter } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { CurvedChevronIcon } from '@/shared/components/icons/CurvedChevronIcon'
import { cn } from '@/shared/lib/cn'

const TITLE_INSET = {
  default: 'pl-6',
  wide: 'pl-[61px]',
}

type MobileScreenHeaderProps = {
  title: string
  action?: ReactNode
  titleInset?: keyof typeof TITLE_INSET
}

export function MobileScreenHeader({
  title,
  action,
  titleInset = 'default',
}: MobileScreenHeaderProps) {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  const goBack = () => {
    if (canGoBack) router.history.back()
    else void router.navigate({ to: '/' })
  }

  return (
    <div className="flex h-11 items-start lg:hidden">
      <button
        type="button"
        onClick={goBack}
        aria-label="Voltar"
        className="flex size-[35px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-surface-raised text-secondary outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <CurvedChevronIcon className="rotate-90" />
      </button>
      <h1 className={cn('type-t-20 flex-1 pt-[9px] text-foreground', TITLE_INSET[titleInset])}>
        {title}
      </h1>
      {action}
    </div>
  )
}
