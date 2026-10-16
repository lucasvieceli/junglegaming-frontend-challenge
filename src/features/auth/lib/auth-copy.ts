export const AUTH_COPY = {
  login: {
    subtitle: 'Entre para gerenciar sua carteira, coleção e perfil de criador.',
    mobileTitle: 'Entrar',
    switchPrompt: 'Novo na Kurio?',
    switchLabel: 'Crie uma conta',
  },
  register: {
    subtitle: 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.',
    mobileTitle: 'Criar perfil de colecionador',
    switchPrompt: 'Já tem uma conta?',
    switchLabel: 'Entre',
  },
} as const

export type AuthMode = keyof typeof AUTH_COPY
