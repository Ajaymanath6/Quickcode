import { useEffect, useState } from 'react'
import CatalogCard, { CatalogEmpty } from '@/components/catalog/CatalogCard'
import { isLayoutEntry } from '@/lib/catalog-entry'
import type { CatalogEntry } from '@/lib/canvas-types'
import { fetchCatalogIndex } from '@/services/publish-workflow'

export default function CatalogLayoutsPage() {
  const [entries, setEntries] = useState<CatalogEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void fetchCatalogIndex()
      .then(setEntries)
      .catch(() => setError('Could not load the catalog. Keep npm run dev running and try again.'))
  }, [])

  const layouts = entries.filter((entry) => isLayoutEntry(entry))

  if (error) {
    return <p className="p-6 text-sm text-brandcolor-warning">{error}</p>
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      {layouts.length === 0 ? (
        <CatalogEmpty
          message="No layouts in the catalog yet."
          to="/admin/canvas?view=layout"
          cta="Open layout workspace"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {layouts.map((entry) => (
            <CatalogCard key={entry.componentId} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
