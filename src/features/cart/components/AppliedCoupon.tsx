import type { Coupon } from '@/shared/contracts/cart'

import { useRemoveCoupon } from '../api/useCoupon'

export function AppliedCoupon({ coupon }: { coupon: Coupon }) {
  const remove = useRemoveCoupon()
  return (
    <div className="flex items-center justify-between gap-3 rounded-xs border border-line px-3 py-2">
      <p className="type-b-14 text-foreground">
        Cupom <strong className="text-accent">{coupon.code}</strong> ({coupon.percentOff}% off)
      </p>
      <button
        type="button"
        onClick={() => remove.mutate()}
        disabled={remove.isPending}
        className="type-b-14 cursor-pointer text-accent hover:underline disabled:opacity-50"
      >
        Remover
      </button>
    </div>
  )
}
