import { useNavigate } from '@tanstack/react-router'
import { useRef } from 'react'

import { cn } from '@/shared/lib/cn'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'

import { AUTH_COPY, type AuthMode } from '../lib/auth-copy'
import { AuthTabs } from './AuthTabs'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { SocialSignIn } from './SocialSignIn'

export function AuthDialog({ mode, redirect }: { mode: AuthMode; redirect?: string }) {
  const navigate = useNavigate()
  const copy = AUTH_COPY[mode]
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <Dialog open onOpenChange={(open) => !open && void navigate({ to: '/' })}>
      <DialogContent
        ref={contentRef}
        className={cn(
          'w-[500px] max-w-[calc(100vw-2rem)] min-h-[600px] translate-y-0 pb-[65px]',
          mode === 'login' ? 'top-[160px]' : 'top-[158px] rounded-lg',
        )}
        aria-describedby={undefined}
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          contentRef.current?.querySelector<HTMLInputElement>('input')?.focus()
        }}
      >
        <div className="flex flex-col items-center gap-10 px-12 pt-12">
          <DialogTitle className="sr-only">
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </DialogTitle>
          <AuthTabs mode={mode} redirect={redirect} />
          <DialogDescription className="type-c-13 text-center text-foreground">
            {copy.subtitle}
          </DialogDescription>
        </div>
        {mode === 'login' ? (
          <LoginForm layout="dialog" redirect={redirect} />
        ) : (
          <RegisterForm layout="dialog" redirect={redirect} />
        )}
        <div className="pt-6">
          <SocialSignIn layout="dialog" mode={mode} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
