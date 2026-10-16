import { FavoriteIcon } from '@/shared/components/nft/FavoriteIcon'
import { Button } from '@/shared/ui/button'

export function FavoriteButton({
  active,
  disabled,
  onToggle,
}: {
  active: boolean
  disabled: boolean
  onToggle: () => void
}) {
  return (
    <Button
      variant="outline"
      size="none"
      className="type-b-14-medium-20 h-10 w-[130px] gap-2 text-accent"
      aria-pressed={active}
      disabled={disabled}
      onClick={onToggle}
    >
      <FavoriteIcon active={active} className="size-5" />
      {active ? 'Favoritado' : 'Favoritar'}
    </Button>
  )
}
