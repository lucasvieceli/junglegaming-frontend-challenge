import { SocialFacebookIcon } from '@/shared/components/icons/SocialFacebookIcon'
import { SocialInstagramIcon } from '@/shared/components/icons/SocialInstagramIcon'
import { SocialLinkedinIcon } from '@/shared/components/icons/SocialLinkedinIcon'
import { SocialTwitterIcon } from '@/shared/components/icons/SocialTwitterIcon'
import { SocialYoutubeIcon } from '@/shared/components/icons/SocialYoutubeIcon'
import { notifyOutOfScope } from '@/shared/lib/out-of-scope'

const NETWORKS = [
  { label: 'Facebook', Icon: SocialFacebookIcon },
  { label: 'Instagram', Icon: SocialInstagramIcon },
  { label: 'X (Twitter)', Icon: SocialTwitterIcon },
  { label: 'LinkedIn', Icon: SocialLinkedinIcon },
  { label: 'YouTube', Icon: SocialYoutubeIcon },
]

export function SocialLinks() {
  return (
    <ul className="flex items-center gap-2.5">
      {NETWORKS.map(({ label, Icon }) => (
        <li key={label}>
          <button
            type="button"
            aria-label={label}
            onClick={() => notifyOutOfScope(`O perfil no ${label}`)}
            className="flex size-[30px] cursor-pointer items-center justify-center text-primary outline-none hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Icon className="size-8 shrink-0" />
          </button>
        </li>
      ))}
    </ul>
  )
}
