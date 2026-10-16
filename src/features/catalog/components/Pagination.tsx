import { CurvedChevronIcon } from '@/shared/components/icons/CurvedChevronIcon'

import { paginationItems } from '../lib/pagination'
import { PaginationLink } from './PaginationLink'

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null
  return (
    <nav aria-label="Paginação" className="self-center lg:self-end">
      <ul className="flex items-center gap-2">
        {page > 1 && (
          <li>
            <PaginationLink page={page - 1} label="Página anterior">
              <CurvedChevronIcon className="h-[6.75px] w-3 rotate-90" />
            </PaginationLink>
          </li>
        )}
        {paginationItems(page, totalPages).map((item, index) => (
          <li key={item === 'ellipsis' ? `ellipsis-${index}` : item}>
            {item === 'ellipsis' ? (
              <span aria-hidden="true" className="type-b-18 px-1 text-text-secondary">
                …
              </span>
            ) : (
              <PaginationLink page={item} label={`Página ${item}`} current={item === page}>
                {item}
              </PaginationLink>
            )}
          </li>
        ))}
        {page < totalPages && (
          <li>
            <PaginationLink page={page + 1} label="Próxima página">
              <CurvedChevronIcon className="h-[6.75px] w-3 -rotate-90" />
            </PaginationLink>
          </li>
        )}
      </ul>
    </nav>
  )
}
