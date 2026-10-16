import { FacebookLogo } from '@/shared/components/icons/FacebookLogo'
import { GoogleLogo } from '@/shared/components/icons/GoogleLogo'
import { notifyOutOfScope } from '@/shared/lib/out-of-scope'

const PROVIDERS = {
  google: { label: 'Continuar com Google', Logo: GoogleLogo },
  facebook: { label: 'Continuar com Facebook', Logo: FacebookLogo },
}

export function SocialButton({ provider }: { provider: keyof typeof PROVIDERS }) {
  const { label, Logo } = PROVIDERS[provider]
  return (
    <button
      type="button"
      onClick={() => notifyOutOfScope('O login social')}
      className="type-c-13-medium flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-[5px] border border-line text-text-secondary outline-none hover:border-primary focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Logo className="size-5" />
      {label}
    </button>
  )
}
