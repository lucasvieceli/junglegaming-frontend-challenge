import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from '@/shared/lib/toast'

import { isApiError } from '@/shared/api/api-error'
import { applyApiFieldErrors } from '@/shared/api/field-errors'
import { queryKeys } from '@/shared/api/query-keys'
import { sessionStore } from '@/shared/session/session-store'

import { changePassword, updateProfile } from '../api/profile.api'
import { EMPTY_PASSWORDS, type ProfileFormValues } from '../lib/profile-form'

export function useSaveProfile(userId: string, form: UseFormReturn<ProfileFormValues>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
      confirmPassword: _confirm,
      ...profile
    }: ProfileFormValues) => {
      const user = await updateProfile(profile)
      queryClient.setQueryData(queryKeys.me(userId), user)
      sessionStore.updateUser(user)
      if (newPassword) await changePassword(currentPassword, newPassword)
      return Boolean(newPassword)
    },
    onSuccess: (passwordChanged) => {
      form.reset({ ...form.getValues(), ...EMPTY_PASSWORDS })
      toast.success(passwordChanged ? 'Perfil e senha atualizados.' : 'Perfil atualizado.')
    },
    onError: (error) => {
      if (!applyApiFieldErrors(error, form.setError))
        toast.error(isApiError(error) ? error.message : 'Não foi possível salvar.')
    },
  })
}
