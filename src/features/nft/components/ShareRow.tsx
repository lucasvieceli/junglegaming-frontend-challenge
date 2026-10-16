import { ShareLinkedinIcon } from '@/shared/components/icons/ShareLinkedinIcon'
import { ShareMessageIcon } from '@/shared/components/icons/ShareMessageIcon'
import { ShareTwitterIcon } from '@/shared/components/icons/ShareTwitterIcon'
import { copyText } from '@/shared/lib/clipboard'
import { toast } from '@/shared/lib/toast'

import { shareUrls } from '../lib/share'

const iconButton =
  'relative flex cursor-pointer items-center justify-center text-primary outline-none before:absolute before:-inset-1 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent'

export function ShareRow({ name }: { name: string }) {
  const url = window.location.href
  const links = shareUrls(url, `${name} na Kurio`)

  const copyLink = async () => {
    const copied = await copyText(url)
    if (copied) toast.success('Link copiado.')
    else toast.error('Não foi possível copiar o link.')
  }

  return (
    <div className="flex items-center gap-2">
      <p className="type-b-15-bold text-foreground">Compartilhar este NFT:</p>
      <a
        href={links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no LinkedIn (abre em nova aba)"
        className={iconButton}
      >
        <ShareLinkedinIcon className="h-[14.4px] w-[15px]" />
      </a>
      <button
        type="button"
        onClick={() => void copyLink()}
        aria-label="Copiar link do NFT"
        className={iconButton}
      >
        <ShareMessageIcon className="size-[18px]" />
      </button>
      <a
        href={links.twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no X (abre em nova aba)"
        className={iconButton}
      >
        <ShareTwitterIcon className="h-[12.2px] w-4" />
      </a>
    </div>
  )
}
