import { useEffect, useState } from 'react'
import CatalogCard, { CatalogEmpty } from '@/components/catalog/CatalogCard'
import { isLayoutEntry } from '@/lib/catalog-entry'
import type { CatalogEntry } from '@/lib/canvas-types'
import { fetchCatalogIndex } from '@/services/publish-workflow'

export default function CatalogAllPage() {
  const [entries, setEntries] = useState<CatalogEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void fetchCatalogIndex()
      .then(setEntries)
      .catch(() => setError('Could not load the catalog. Keep npm run dev running and try again.'))
  }, [])

  const components = entries.filter((entry) => !isLayoutEntry(entry))

  if (error) {
    return <p className="p-6 text-sm text-brandcolor-warning">{error}</p>
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      {components.length === 0 ? (
        <CatalogEmpty
          message="No published components yet."
          to="/admin/canvas"
          cta="Open canvas"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((entry) => (
            <CatalogCard key={entry.componentId} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
