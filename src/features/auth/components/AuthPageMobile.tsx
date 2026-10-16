import { Link } from '@tanstack/react-router'

import { AUTH_COPY, type AuthMode } from '../lib/auth-copy'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { SocialSignIn } from './SocialSignIn'

export function AuthPageMobile({ mode, redirect }: { mode: AuthMode; redirect?: string }) {
  const copy = AUTH_COPY[mode]
  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col gap-10 px-1 pt-14 pb-6">
      <Link
        to="/"
        aria-label="Kurio — página inicial"
        className="type-display-32 flex h-[136px] items-center justify-center text-foreground"
      >
        KURIO
      </Link>
      <h1 className="type-t-20 text-center text-foreground">{copy.mobileTitle}</h1>
      <div className="flex flex-col gap-10">
        {mode === 'login' ? (
          <LoginForm layout="page" redirect={redirect} />
        ) : (
          <RegisterForm layout="page" redirect={redirect} />
        )}
        <SocialSignIn layout="page" mode={mode} />
      </div>
      <p className="type-b-15 text-center text-text-secondary">
        <Link
          to={mode === 'login' ? '/register' : '/login'}
          search={{ redirect }}
          replace
          className="rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {copy.switchPrompt} {copy.switchLabel}
        </Link>
      </p>
    </div>
  )
}
