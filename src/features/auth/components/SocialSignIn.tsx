import { cn } from '@/shared/lib/cn'

import type { AuthMode } from '../lib/auth-copy'
import type { AuthLayout } from '../lib/auth-forms'
import { SocialButton } from './SocialButton'

export function SocialSignIn({ layout, mode }: { layout: AuthLayout; mode: AuthMode }) {
  const dialogGap = mode === 'register' ? 'gap-4' : 'gap-3'
  return (
    <div className={cn('flex flex-col', layout === 'dialog' ? dialogGap : 'gap-3')}>
      <div className={cn('flex items-center', layout === 'dialog' ? 'gap-3' : 'gap-2.5')}>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
        <p className="type-c-13 text-foreground">Ou continue com</p>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>
      <div className={cn('flex flex-col', layout === 'dialog' ? cn(dialogGap, 'px-20') : 'gap-4')}>
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>
    </div>
  )
}
