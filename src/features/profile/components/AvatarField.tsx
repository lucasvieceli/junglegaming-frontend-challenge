import { useId, useRef } from 'react'

import { ImageIcon } from '@/shared/components/icons/ImageIcon'
import { Button } from '@/shared/ui/button'

import { useAvatar } from '../hooks/useAvatar'
import { ACCEPTED_IMAGE_TYPES } from '../lib/resize-image'

export function AvatarField({ userId, avatarUrl }: { userId: string; avatarUrl: string | null }) {
  const inputId = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const avatar = useAvatar(userId)

  return (
    <div className="flex flex-col gap-2.5">
      <span className="type-b-15-15 text-foreground" id={`${inputId}-label`}>
        Avatar
      </span>
      <div className="flex items-center gap-6">
        <span className="flex size-[50px] items-center justify-center overflow-hidden rounded-full border border-line bg-surface-raised">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Seu avatar" className="size-full object-cover" />
          ) : (
            <ImageIcon aria-hidden="true" className="size-6 text-primary" />
          )}
        </span>
        <div className="flex items-center gap-5">
          <input
            ref={fileInput}
            id={inputId}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            className="sr-only"
            aria-labelledby={`${inputId}-label`}
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) avatar.upload.mutate(file)
              event.target.value = ''
            }}
          />
          <Button
            type="button"
            size="none"
            radius="xs"
            className="type-b-14-bold h-10 w-[98px]"
            disabled={avatar.busy}
            onClick={() => fileInput.current?.click()}
          >
            Alterar
          </Button>
          <button
            type="button"
            disabled={avatar.busy || !avatarUrl}
            onClick={() => avatar.remove.mutate()}
            className="type-b-14 cursor-pointer text-foreground hover:text-accent disabled:cursor-not-allowed"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  )
}
