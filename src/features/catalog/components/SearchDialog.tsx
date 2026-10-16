import { useNavigate } from '@tanstack/react-router'
import { useId, useState, type FormEvent } from 'react'

import { SearchIcon } from '@/shared/components/icons/SearchIcon'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'

import { useSearchSuggestions } from '../api/useSearchSuggestions'
import { SEARCH_DEBOUNCE_MS } from '../lib/search-constants'
import { SearchFilters } from './SearchFilters'
import { SearchSuggestions } from './SearchSuggestions'

type SearchDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  withFilters?: boolean
}

export function SearchDialog({ open, onOpenChange, withFilters = false }: SearchDialogProps) {
  const navigate = useNavigate()
  const inputId = useId()
  const [text, setText] = useState('')
  const q = useDebouncedValue(text.trim(), SEARCH_DEBOUNCE_MS)
  const suggestions = useSearchSuggestions(q)

  const close = () => {
    onOpenChange(false)
    setText('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const term = text.trim() || undefined
    close()
    void navigate({ to: '/', search: (prev) => ({ ...prev, q: term, page: 1 }), hash: 'catalog' })
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="top-[8%] flex max-h-[84dvh] w-[min(92vw,560px)] max-w-none translate-y-0 flex-col gap-4 overflow-y-auto p-6 lg:top-[15%]">
        <DialogTitle className="type-b-16-bold">
          {withFilters ? 'Buscar e filtrar NFTs' : 'Buscar NFTs'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Digite o nome de um NFT e pressione Enter para ver os resultados.
        </DialogDescription>
        <form
          role="search"
          onSubmit={handleSubmit}
          className="flex h-10 items-center gap-2 rounded-xs border border-line px-3 focus-within:border-primary"
        >
          <SearchIcon aria-hidden="true" className="size-5 shrink-0 text-secondary" />
          <label htmlFor={inputId} className="sr-only">
            Nome do NFT
          </label>
          <input
            id={inputId}
            type="search"
            autoComplete="off"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Ex.: Golden Beat"
            className="type-b-16 h-full min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-secondary"
          />
        </form>
        {suggestions.data && suggestions.data.length > 0 && (
          <SearchSuggestions items={suggestions.data} onSelect={close} />
        )}
        {withFilters && <SearchFilters />}
        {suggestions.data?.length === 0 && (
          <p role="status" className="type-b-14 text-text-secondary">
            Nenhum NFT com “{q}”.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
