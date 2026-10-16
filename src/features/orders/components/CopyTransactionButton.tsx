import { toast } from '@/shared/lib/toast'

import { ShareMessageIcon } from '@/shared/components/icons/ShareMessageIcon'
import { copyText } from '@/shared/lib/clipboard'

export function CopyTransactionButton({ value }: { value: string }) {
  const copy = async () => {
    if (await copyText(value)) toast.success('ID da transação copiado.')
    else toast.error('Não foi possível copiar.')
  }
  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label="Copiar ID da transação"
      className="flex size-5 cursor-pointer items-center justify-center text-primary hover:text-accent"
    >
      <ShareMessageIcon className="size-3.5" />
    </button>
  )
}
