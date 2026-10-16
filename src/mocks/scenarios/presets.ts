import { messages } from '../lib/messages'
import type { ScenarioConfig } from './types'

const EIGHT_HOURS = 8 * 3_600_000

const base: ScenarioConfig = {
  name: 'default',
  description: 'Sucesso: latência 250 ms, pagamento confirmado em 4 s, carteira conecta em 1,5 s.',
  latency: { mode: 'fixed', minMs: 250, maxMs: 250 },
  network: 'online',
  failures: [],
  timeouts: [],
  session: { ttlMs: EIGHT_HOURS },
  payment: { outcome: 'confirmed', delayMs: 4000 },
  walletConnect: { outcome: 'connected', delayMs: 1500 },
  catalog: { empty: false },
  realtime: [],
}

const scenario = (
  name: string,
  description: string,
  patch: Partial<ScenarioConfig>,
): ScenarioConfig => ({
  ...base,
  ...patch,
  name,
  description,
})

const NFTS = /\/nfts(\/[^/]+)?$/

export const SCENARIOS = {
  default: base,
  'empty-catalog': scenario('empty-catalog', 'Catálogo sem resultados.', {
    catalog: { empty: true },
  }),
  'slow-network': scenario('slow-network', 'Rede lenta: 2,5 s em todas as respostas (skeletons).', {
    latency: { mode: 'fixed', minMs: 2500, maxMs: 2500 },
  }),
  'variable-latency': scenario(
    'variable-latency',
    'Latência variável entre 100 ms e 2 s (semente fixa).',
    {
      latency: { mode: 'variable', minMs: 100, maxMs: 2000 },
    },
  ),
  'out-of-order': scenario(
    'out-of-order',
    'Respostas do catálogo chegam fora de ordem (0–1,5 s).',
    {
      latency: { mode: 'out-of-order', minMs: 0, maxMs: 1500 },
    },
  ),
  offline: scenario('offline', 'Sem conexão: toda requisição falha e o socket cai.', {
    network: 'offline',
  }),
  'server-error': scenario(
    'server-error',
    'Catálogo e detalhe respondem 503 nas 2 primeiras tentativas.',
    {
      failures: [
        {
          match: NFTS,
          method: 'GET',
          status: 503,
          code: 'SERVICE_UNAVAILABLE',
          message: messages.serviceUnavailable,
          mode: 'first-n',
          times: 2,
        },
      ],
    },
  ),
  'client-error': scenario(
    'client-error',
    'Adicionar ao carrinho responde 409 (limite de disponibilidade).',
    {
      failures: [
        {
          match: /\/cart\/items$/,
          method: 'POST',
          status: 409,
          code: 'QUANTITY_EXCEEDS_AVAILABILITY',
          message: messages.quantityExceeds(1),
          mode: 'always',
        },
      ],
    },
  ),
  'session-expired': scenario('session-expired', 'Sessões expiram 15 s após o login.', {
    session: { ttlMs: 15_000 },
  }),
  unauthorized: scenario('unauthorized', 'Favoritos e pedidos respondem 403 (sem permissão).', {
    failures: [
      {
        match: /\/favorites$/,
        method: 'GET',
        status: 403,
        code: 'FORBIDDEN',
        message: messages.forbidden,
        mode: 'always',
      },
      {
        match: /\/orders(\/[^/]+)?$/,
        status: 403,
        code: 'FORBIDDEN',
        message: messages.forbidden,
        mode: 'always',
      },
    ],
  }),
  'register-conflict': scenario(
    'register-conflict',
    'Cadastro sempre em conflito (e-mail já usado).',
    {
      failures: [
        {
          match: /\/auth\/register$/,
          method: 'POST',
          status: 409,
          code: 'EMAIL_TAKEN',
          message: messages.emailTaken,
          mode: 'always',
          fieldErrors: { email: [messages.emailTaken] },
        },
      ],
    },
  ),
  'validation-errors': scenario(
    'validation-errors',
    'Perfil, carteiras e pedido retornam 422 com erros por campo.',
    {
      failures: [
        {
          match: /\/me$/,
          method: 'PATCH',
          status: 422,
          code: 'VALIDATION_ERROR',
          message: messages.validation,
          mode: 'always',
          fieldErrors: { username: ['Este nome de usuário não é permitido.'] },
        },
        {
          match: /\/wallets(\/[^/]+)?$/,
          method: 'POST',
          status: 422,
          code: 'VALIDATION_ERROR',
          message: messages.validation,
          mode: 'always',
          fieldErrors: { address: ['Endereço não reconhecido pela rede selecionada.'] },
        },
        {
          match: /\/orders$/,
          method: 'POST',
          status: 422,
          code: 'VALIDATION_ERROR',
          message: messages.validation,
          mode: 'always',
          fieldErrors: { 'collector.referralCode': ['Código de indicação não encontrado.'] },
        },
      ],
    },
  ),
  'coupon-invalid': scenario('coupon-invalid', 'Qualquer cupom é inválido.', {
    failures: [
      {
        match: /\/cart\/coupon$/,
        method: 'POST',
        status: 422,
        code: 'COUPON_INVALID',
        message: messages.couponInvalid,
        mode: 'always',
      },
    ],
  }),
  'coupon-expired': scenario('coupon-expired', 'Qualquer cupom está expirado.', {
    failures: [
      {
        match: /\/cart\/coupon$/,
        method: 'POST',
        status: 422,
        code: 'COUPON_EXPIRED',
        message: messages.couponExpired('30/09/2026'),
        mode: 'always',
      },
    ],
  }),
  'price-changed-during-checkout': scenario(
    'price-changed-during-checkout',
    '3 s após a cotação do checkout, o preço do 1º item sobe 10%.',
    {
      realtime: [{ on: 'checkout_quote', afterMs: 3000, action: 'nft_price_up' }],
    },
  ),
  'edition-sold-out-during-checkout': scenario(
    'edition-sold-out-during-checkout',
    '3 s após a cotação do checkout, o 1º item esgota.',
    {
      realtime: [{ on: 'checkout_quote', afterMs: 3000, action: 'nft_sold_out' }],
    },
  ),
  'order-timeout-recover': scenario(
    'order-timeout-recover',
    'Pedido é criado na hora, mas a 1ª resposta demora 12 s (timeout do cliente).',
    {
      timeouts: [{ match: /\/orders$/, method: 'POST', delayMs: 12_000, times: 1 }],
    },
  ),
  'payment-declined': scenario('payment-declined', 'Pagamento recusado 3 s após o pedido.', {
    payment: {
      outcome: 'declined',
      delayMs: 3000,
      declineReason: 'Transação recusada pela carteira.',
    },
  }),
  'payment-stuck-pending': scenario(
    'payment-stuck-pending',
    'Pedido fica pendente até ação manual (painel/window.__kurio).',
    {
      payment: { outcome: 'stuck', delayMs: 0 },
    },
  ),
  'favorites-fail': scenario(
    'favorites-fail',
    'Favoritar/desfavoritar responde 503 (rollback otimista).',
    {
      failures: [
        {
          match: /\/favorites\/[^/]+$/,
          status: 503,
          code: 'SERVICE_UNAVAILABLE',
          message: messages.serviceUnavailable,
          mode: 'always',
        },
      ],
    },
  ),
  'wallet-connect-rejected': scenario('wallet-connect-rejected', 'A carteira recusa a conexão.', {
    walletConnect: { outcome: 'rejected', delayMs: 1500 },
  }),
  'wallet-disconnect': scenario(
    'wallet-disconnect',
    'A carteira desconecta 5 s depois de conectar.',
    {
      realtime: [{ on: 'wallet_connected', afterMs: 5000, action: 'disconnect_wallet' }],
    },
  ),
  'socket-drop': scenario(
    'socket-drop',
    'O socket cai 2 s após criar o pedido (reconecta sozinho).',
    {
      payment: { outcome: 'confirmed', delayMs: 8000 },
      realtime: [{ on: 'order_created', afterMs: 2000, action: 'drop_socket' }],
    },
  ),
} satisfies Record<string, ScenarioConfig>

export type ScenarioName = keyof typeof SCENARIOS
export const SCENARIO_NAMES = Object.keys(SCENARIOS) as ScenarioName[]

export function isScenarioName(value: string | null | undefined): value is ScenarioName {
  return Boolean(value && value in SCENARIOS)
}
