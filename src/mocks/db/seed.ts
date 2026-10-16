import type { NftDetail } from '@/shared/contracts/nft'

import { daysAgo, daysFromNow, hoursAgo, now } from '../lib/clock'
import { hashPassword } from '../lib/password'
import { COUPON_ROWS } from './fixtures/coupons'
import { REVIEW_TEMPLATES, buildNftCopy } from './fixtures/copy'
import { COLLECTIONS } from './fixtures/catalog-taxonomy'
import { buildEditions } from './fixtures/editions'
import { NFT_ROWS, type NftRow } from './fixtures/nfts'
import { DEMO_PASSWORD, USER_ROWS } from './fixtures/users'
import { WALLET_ROWS } from './fixtures/wallets'
import type { MockDb } from './schema'

export const SEED_VERSION = 2

function availabilityOf(row: NftRow): NftDetail['availability'] {
  if (row.stock === 'sold_out') return 'sold_out'
  return row.stock === 'low' ? 'low' : 'available'
}

const RELATED_COUNT = 7

function buildNft(row: NftRow, reference: Date): NftDetail {
  const copy = buildNftCopy(row)
  const related = NFT_ROWS.filter(
    (other) => other.collection === row.collection && other.id !== row.id,
  ).slice(0, RELATED_COUNT)
  return {
    id: row.id,
    slug: row.id.replace(/^nft_/, '').replaceAll('_', '-'),
    name: row.name,
    tokenId: row.tokenId,
    collection: { slug: row.collection, name: COLLECTIONS[row.collection].name },
    category: row.category,
    network: row.network,
    price: row.price,
    previousPrice: row.previousPrice,
    imageKey: row.imageKey,
    rare: row.rare,
    trending: row.trending,
    listedAt: hoursAgo(row.listedHoursAgo, reference),
    availability: availabilityOf(row),
    version: 1,
    description: copy.description,
    about: copy.about,
    attributes: row.attributes,
    creator: copy.creator,
    royaltiesPct: 5,
    contract: copy.contract,
    rating: { average: 4.8, count: 19 },
    reviews: REVIEW_TEMPLATES.map((review, index) => ({
      ...review,
      date: daysAgo(3 + index * 9, reference),
    })),
    editions: buildEditions(row.editions, row.stock),
    relatedIds: related.map((other) => other.id),
  }
}

export async function buildSeed(): Promise<MockDb> {
  const reference = now()
  const db: MockDb = {
    meta: { seedVersion: SEED_VERSION, counters: {} },
    users: {},
    sessions: {},
    nfts: {},
    featured: {
      hero: ['nft_emerald_ape_042', 'nft_sage_nomad_009', 'nft_golden_beat_207'],
      sidebar: 'nft_sage_nomad_009',
    },
    favorites: {},
    carts: {},
    coupons: {},
    quotes: {},
    orders: {},
    idempotency: {},
    wallets: {},
    walletConnections: {},
    events: { lastVersionByResource: {} },
  }

  for (const row of NFT_ROWS) db.nfts[row.id] = buildNft(row, reference)

  for (const user of USER_ROWS) {
    const { salt, hash } = await hashPassword(DEMO_PASSWORD)
    db.users[user.id] = {
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      email: user.email,
      avatarUrl: null,
      ensName: user.ensName,
      walletAlias: user.walletAlias,
      createdAt: daysAgo(user.createdDaysAgo, reference),
      passwordHash: hash,
      salt,
    }
    db.favorites[user.id] = [...user.favorites]
  }

  for (const wallet of WALLET_ROWS) {
    const createdAt = daysAgo(30, reference)
    db.wallets[wallet.id] = { ...wallet, createdAt, updatedAt: createdAt }
  }

  for (const coupon of COUPON_ROWS) {
    db.coupons[coupon.code] = {
      code: coupon.code,
      percentOff: coupon.percentOff,
      expiresAt:
        coupon.expiresInDays === null ? null : daysFromNow(coupon.expiresInDays, reference),
    }
  }

  return db
}
