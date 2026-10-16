import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'

import type { AuthLayout } from '../lib/auth-forms'

export function AuthSubmitButton({
  layout,
  pending,
  children,
}: {
  layout: AuthLayout
  pending: boolean
  children: ReactNode
}) {
  return (
    <div className={cn(layout === 'dialog' ? 'px-20 pt-6' : 'pt-10')}>
      <Button
        type="submit"
        size="none"
        radius={layout === 'dialog' ? 'sm' : 'xl'}
        className={cn('type-b-16-bold w-full', layout === 'dialog' ? 'h-[45px]' : 'h-[60px]')}
        disabled={pending}
        aria-busy={pending}
      >
        {children}
      </Button>
    </div>
  )
}
