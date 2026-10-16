import { realtimeHandler } from '../ws/realtime.handler'
import { authHandlers } from './auth.handlers'
import { cartHandlers } from './cart.handlers'
import { favoritesHandlers } from './favorites.handlers'
import { nftHandlers } from './nfts.handlers'
import { orderHandlers } from './orders.handlers'
import { profileHandlers } from './profile.handlers'
import { walletHandlers } from './wallets.handlers'

export const handlers = [
  ...authHandlers,
  ...nftHandlers,
  ...favoritesHandlers,
  ...cartHandlers,
  ...orderHandlers,
  ...profileHandlers,
  ...walletHandlers,
  realtimeHandler,
]
