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
        ? 'border-brandcolor-primary bg-brandcolor-primary text-white'
        : 'border-brandcolor-strokeweak bg-white text-brandcolor-textstrong hover:bg-brandcolor-fill'
    }`

  return (
    <div className="space-y-2">
      <label className="relative block">
        <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brandcolor-textweak" />
        <input
          type="search"
          value={props.query}
          onChange={(event) => props.onQueryChange(event.target.value)}
          placeholder="Search library…"
          className="w-full rounded-xl border border-brandcolor-strokeweak bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brandcolor-primary focus:ring-2 focus:ring-brandcolor-secondaryfill"
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
