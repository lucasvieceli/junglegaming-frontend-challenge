import { useMutation } from '@tanstack/react-query'

import type { LoginRequest } from '@/shared/contracts/auth'

import { login } from '../api/auth.api'
import { useAfterAuthentication } from './useAfterAuthentication'

export function useLogin(redirect: string | undefined) {
  const afterAuthentication = useAfterAuthentication(redirect)
  return useMutation({
    mutationFn: (body: LoginRequest) => login(body),
    onSuccess: afterAuthentication,
  })
}
