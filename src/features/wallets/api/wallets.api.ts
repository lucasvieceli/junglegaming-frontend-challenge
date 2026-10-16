import { http } from '@/shared/api/http-client'
import { WalletSchema, type SaveWalletRequest, type Wallet } from '@/shared/contracts/wallet'

export async function createWallet(body: SaveWalletRequest): Promise<Wallet> {
  return WalletSchema.parse((await http.post('/wallets', body)).data)
}

export async function updateWallet(id: string, body: Partial<SaveWalletRequest>): Promise<Wallet> {
  return WalletSchema.parse((await http.patch(`/wallets/${encodeURIComponent(id)}`, body)).data)
}
