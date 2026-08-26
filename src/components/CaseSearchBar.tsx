import { useState } from 'react'

export default function CaseSearchBar() {
  const [query, setQuery] = useState('')
  const hasQuery = query.trim().length > 0

  return (
    <div className="font-lato">
      <label className="sr-only" htmlFor="case-search">
        Search cases
      </label>
      <div className="flex w-full items-center gap-2 rounded-md border border-brandcolor-strokeweak bg-brandcolor-white px-2 py-1.5 focus-within:border-brandcolor-strokestrong">
        <input
          id="case-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by case name…"
          className="min-w-0 flex-1 border-0 bg-transparent px-2 py-1.5 text-sm text-brandcolor-textstrong placeholder:text-brandcolor-textweak focus:outline-none"
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="shrink-0 rounded-md bg-transparent px-3 py-1.5 text-sm font-medium text-brandcolor-textweak transition-colors hover:bg-brandcolor-neutralhover hover:text-brandcolor-textstrong"
          >
            Clear text
          </button>
        ) : null}
      </div>
    </div>
  )
}
