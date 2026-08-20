import { RiSearchLine } from '@remixicon/react'

type Props = {
  query: string
  onQueryChange: (value: string) => void
  bookmarkedOnly: boolean
  onBookmarkedOnlyChange: (value: boolean) => void
  sealedOnly: boolean
  onSealedOnlyChange: (value: boolean) => void
  recentOnly: boolean
  onRecentOnlyChange: (value: boolean) => void
}

export default function CatalogSearchFilters(props: Props) {
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs transition ${
      active
        ? 'border-brandcolor-700 bg-brandcolor-700 text-white'
        : 'border-brandcolor-200 bg-white text-brandcolor-700 hover:bg-brandcolor-50'
    }`

  return (
    <div className="space-y-2">
      <label className="relative block">
        <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brandcolor-500" />
        <input
          type="search"
          value={props.query}
          onChange={(event) => props.onQueryChange(event.target.value)}
          placeholder="Search library…"
          className="w-full rounded-xl border border-brandcolor-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brandcolor-700 focus:ring-2 focus:ring-brandcolor-100"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button className={chip(props.bookmarkedOnly)} onClick={() => props.onBookmarkedOnlyChange(!props.bookmarkedOnly)}>
          Bookmarked
        </button>
        <button className={chip(props.sealedOnly)} onClick={() => props.onSealedOnlyChange(!props.sealedOnly)}>
          Sealed
        </button>
        <button className={chip(props.recentOnly)} onClick={() => props.onRecentOnlyChange(!props.recentOnly)}>
          Last 30 days
        </button>
      </div>
    </div>
  )
}
