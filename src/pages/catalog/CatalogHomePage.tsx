import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CatalogCard, { CatalogEmpty } from '@/components/catalog/CatalogCard'
import { isLayoutEntry } from '@/lib/catalog-entry'
import type { CatalogEntry } from '@/lib/canvas-types'
import { fetchCatalogIndex } from '@/services/publish-workflow'

export default function CatalogHomePage() {
  const [entries, setEntries] = useState<CatalogEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void fetchCatalogIndex()
      .then(setEntries)
      .catch(() => setError('Could not load the catalog. Keep npm run dev running and try again.'))
  }, [])

  const components = entries.filter((entry) => !isLayoutEntry(entry)).slice(0, 6)
  const layouts = entries.filter((entry) => isLayoutEntry(entry)).slice(0, 6)

  if (error) {
    return <p className="p-6 text-sm text-brandcolor-warning">{error}</p>
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">Components</h2>
          <Link to="/catalog/all" className="text-[13px] text-brandcolor-700">
            View all
          </Link>
        </div>
        {components.length === 0 ? (
          <CatalogEmpty
            message="No published components yet. Capture a block on the canvas to publish."
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
      </section>
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">Layouts</h2>
          <Link to="/catalog/layouts" className="text-[13px] text-brandcolor-700">
            View all
          </Link>
        </div>
        {layouts.length === 0 ? (
          <CatalogEmpty message="No layout entries yet. Use Layout workspace to save layout prompts." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {layouts.map((entry) => (
              <CatalogCard key={entry.componentId} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
