import { useMutation } from '@tanstack/react-query'

import type { RegisterRequest } from '@/shared/contracts/auth'

import { register } from '../api/auth.api'
import { useAfterAuthentication } from './useAfterAuthentication'

export function useRegister(redirect: string | undefined) {
  const afterAuthentication = useAfterAuthentication(redirect)
  return useMutation({
    mutationFn: (body: RegisterRequest) => register(body),
    onSuccess: afterAuthentication,
  })
}
