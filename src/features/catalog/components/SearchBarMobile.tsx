import { useId } from 'react'

import { SearchMobileIcon } from '@/shared/components/icons/SearchMobileIcon'

import { useSearchDraft } from '../hooks/useSearchDraft'

type SearchBarMobileProps = {
  value: string | undefined
  onSearch: (q: string | undefined) => void
}

export function SearchBarMobile({ value, onSearch }: SearchBarMobileProps) {
  const inputId = useId()
  const { draft, setDraft } = useSearchDraft(value, onSearch)

  return (
    <div
      role="search"
      className="flex h-[45px] min-w-0 flex-1 items-center gap-2 rounded-[10px] bg-surface-card px-3 focus-within:ring-2 focus-within:ring-accent"
    >
      <label htmlFor={inputId} className="sr-only">
        Buscar NFTs
      </label>
      <SearchMobileIcon aria-hidden="true" className="size-[22px] shrink-0 text-secondary" />
      <input
        id={inputId}
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Explorar coleções"
        autoComplete="off"
        className="type-b-14-bold h-full min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-secondary"
      />
    </div>
  )
}
