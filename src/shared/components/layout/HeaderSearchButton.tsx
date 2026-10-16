import { SearchIcon } from '@/shared/components/icons/SearchIcon'

export function HeaderSearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Buscar NFTs"
      className="flex size-5 cursor-pointer items-center justify-center text-foreground outline-none hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
    >
      <SearchIcon />
    </button>
  )
}
