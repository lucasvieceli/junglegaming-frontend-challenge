import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/shared/lib/toast'

import { isApiError } from '@/shared/api/api-error'
import { queryKeys } from '@/shared/api/query-keys'
import type { User } from '@/shared/contracts/auth'
import { sessionStore } from '@/shared/session/session-store'

import { removeAvatar, uploadAvatar } from '../api/profile.api'
import { resizeAvatar } from '../lib/resize-image'

export function useAvatar(userId: string) {
  const queryClient = useQueryClient()
  const setAvatar = (avatarUrl: string | null) => {
    const user = queryClient.setQueryData<User>(
      queryKeys.me(userId),
      (me) => me && { ...me, avatarUrl },
    )
    if (user) sessionStore.updateUser(user)
  }
  const onError = (error: unknown) =>
    toast.error(
      isApiError(error) || error instanceof Error
        ? error.message
        : 'Não foi possível atualizar o avatar.',
    )

  const upload = useMutation({
    mutationFn: async (file: File) => uploadAvatar(await resizeAvatar(file)),
    onSuccess: (url) => {
      setAvatar(url)
      toast.success('Avatar atualizado.')
    },
    onError,
  })
  const remove = useMutation({
    mutationFn: removeAvatar,
    onSuccess: () => setAvatar(null),
    onError,
  })
  return { upload, remove, busy: upload.isPending || remove.isPending }
}
