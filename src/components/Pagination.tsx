import { useState } from 'react'
import GoogleDuotoneIcon from '@/components/GoogleDuotoneIcon'

const TOTAL_PAGES = 20

type PaginationProps = {
  totalPages?: number
  initialPage?: number
}

export default function Pagination({
  totalPages = TOTAL_PAGES,
  initialPage = 1,
}: PaginationProps) {
  const [page, setPage] = useState(initialPage)
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1 font-lato" aria-label="Pagination">
      <button
        type="button"
        className="inline-flex size-8 items-center justify-center rounded-md text-brandcolor-textstrong transition-colors hover:bg-brandcolor-fill disabled:opacity-40"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => setPage((current) => Math.max(1, current - 1))}
      >
        <GoogleDuotoneIcon name="chevron_left" className="text-[22px] !text-brandcolor-textstrong" />
      </button>

      {pages.map((number) => {
        const selected = number === page
        return (
          <button
            key={number}
            type="button"
            aria-current={selected ? 'page' : undefined}
            onClick={() => setPage(number)}
            className={`inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
              selected
                ? 'bg-brandcolor-white text-brandcolor-textstrong'
                : 'bg-brandcolor-fill text-brandcolor-textstrong hover:bg-brandcolor-neutralhover'
            }`}
          >
            {number}
          </button>
        )
      })}

      <button
        type="button"
        className="inline-flex size-8 items-center justify-center rounded-md text-brandcolor-textstrong transition-colors hover:bg-brandcolor-fill disabled:opacity-40"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
      >
        <GoogleDuotoneIcon name="chevron_right" className="text-[22px] !text-brandcolor-textstrong" />
      </button>
    </nav>
  )
}
