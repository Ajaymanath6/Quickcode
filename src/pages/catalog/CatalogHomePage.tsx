import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import CatalogDetailModal from '@/components/catalog/CatalogDetailModal'
import CatalogGrid from '@/components/catalog/CatalogGrid'
import CatalogSearchFilters from '@/components/catalog/CatalogSearchFilters'
import { CatalogEmpty } from '@/components/catalog/CatalogCard'
import { useCatalogCards } from '@/context/CatalogContext'
import { useCatalogModal } from '@/hooks/useCatalogModal'
import { useCatalogSearch } from '@/hooks/useCatalogSearch'
import { writeCatalogDrag } from '@/lib/catalog-drag'
import { isLayoutEntry } from '@/lib/catalog-entry'
import { publishToCatalog } from '@/services/publish-workflow'

export default function CatalogHomePage() {
  const { cards, loading, error, bookmarks, refreshCatalog } = useCatalogCards()
  const search = useCatalogSearch(cards, bookmarks)
  const modal = useCatalogModal(cards)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showAllComponents, setShowAllComponents] = useState(false)
  const [showAllLayouts, setShowAllLayouts] = useState(false)
  const [importMessage, setImportMessage] = useState<string | null>(null)

  const components = search.filteredCards.filter((card) => !isLayoutEntry(card.entry))
  const layouts = search.filteredCards.filter((card) => isLayoutEntry(card.entry))
  const visibleComponents = showAllComponents ? components : components.slice(0, 6)
  const visibleLayouts = showAllLayouts ? layouts : layouts.slice(0, 6)

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const isHtml = file.name.toLowerCase().endsWith('.html')
      const parsed = isHtml ? null : (JSON.parse(text) as Record<string, unknown>)
      const sourceHtml =
        isHtml
          ? text
          : typeof parsed?.sourceHtml === 'string'
            ? parsed.sourceHtml
            : ''
      if (!sourceHtml.trim()) throw new Error('Import needs sourceHtml or an HTML file.')
      const rawId =
        typeof parsed?.componentId === 'string'
          ? parsed.componentId
          : typeof parsed?.id === 'string'
            ? parsed.id
            : `import-${crypto.randomUUID()}`
      const label =
        typeof parsed?.label === 'string'
          ? parsed.label
          : typeof parsed?.name === 'string'
            ? parsed.name
            : file.name.replace(/\.(json|html)$/i, '')
      await publishToCatalog({
        componentId: rawId,
        label,
        sourceHtml,
        description: typeof parsed?.description === 'string' ? parsed.description : undefined,
        sealed: Boolean(parsed?.sealed),
        kind: parsed?.kind === 'layout' ? 'layout' : 'component',
        blueprint:
          parsed?.blueprint && typeof parsed.blueprint === 'object'
            ? (parsed.blueprint as Record<string, unknown>)
            : parsed ?? { importedFrom: file.name },
      })
      await refreshCatalog()
      setImportMessage(`Imported “${label}”.`)
    } catch (importError) {
      setImportMessage(importError instanceof Error ? importError.message : 'Import failed.')
    } finally {
      event.target.value = ''
    }
  }

  if (error) {
    return <p className="p-6 text-sm text-brandcolor-banner-warning-button">{error}</p>
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Library</h2>
          <p className="mt-1 text-sm text-brandcolor-textweak">Browse published components and UI pages.</p>
        </div>
        <div className="flex gap-2">
          <input ref={inputRef} type="file" accept=".json,.html,text/html,application/json" className="hidden" onChange={(event) => void importFile(event)} />
          <button className="rounded-md border border-brandcolor-strokeweak bg-white px-3 py-2 text-xs" onClick={() => inputRef.current?.click()}>
            Import
          </button>
          <button className="rounded-md border border-brandcolor-strokeweak bg-white px-3 py-2 text-xs opacity-50" disabled title="Figma and GitHub integrations need OAuth configuration.">
            Integrations
          </button>
        </div>
      </div>
      {importMessage ? <p role="status" className="text-xs text-brandcolor-textstrong">{importMessage}</p> : null}
      <CatalogSearchFilters
        query={search.query}
        onQueryChange={search.setQuery}
        bookmarkedOnly={search.bookmarkedOnly}
        onBookmarkedOnlyChange={search.setBookmarkedOnly}
        sealedOnly={search.sealedOnly}
        onSealedOnlyChange={search.setSealedOnly}
        recentOnly={search.recentOnly}
        onRecentOnlyChange={search.setRecentOnly}
      />
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <h3 className="text-sm font-semibold">UI components</h3>
            <p className="text-xs text-brandcolor-textweak">{components.length} visible components</p>
          </div>
          <Link to="/catalog/all" className="text-[13px] text-brandcolor-textstrong">
            View all
          </Link>
        </div>
        {loading ? (
          <LoadingGrid />
        ) : components.length === 0 ? (
          <CatalogEmpty
            message="No published components yet. Open the canvas and publish a block to see it here."
            to="/admin/canvas"
            cta="Open canvas"
          />
        ) : (
          <>
            <CatalogGrid
              cards={visibleComponents}
              onOpen={modal.openCard}
              onDragStart={(card, event) => writeCatalogDrag(event, card)}
            />
            {components.length > 6 ? (
              <button className="mt-3 text-xs font-medium text-brandcolor-textstrong" onClick={() => setShowAllComponents((value) => !value)}>
                {showAllComponents ? 'See less' : `See more (${components.length - 6})`}
              </button>
            ) : null}
          </>
        )}
      </section>
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <h3 className="text-sm font-semibold">UI pages</h3>
            <p className="text-xs text-brandcolor-textweak">{layouts.length} published layouts</p>
          </div>
          <Link to="/catalog/layouts" className="text-[13px] text-brandcolor-textstrong">
            View all
          </Link>
        </div>
        {loading ? (
          <LoadingGrid />
        ) : layouts.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {['Dashboard shell', 'Settings page', 'Marketing page'].map((label) => (
              <div key={label} className="aspect-[278/209] rounded-xl border border-dashed border-brandcolor-strokeweak bg-white p-4 text-xs text-brandcolor-textweak">
                {label} idea · publish a layout to replace this placeholder
              </div>
            ))}
          </div>
        ) : (
          <>
            <CatalogGrid
              cards={visibleLayouts}
              onOpen={modal.openCard}
              onDragStart={(card, event) => writeCatalogDrag(event, card)}
            />
            {layouts.length > 6 ? (
              <button className="mt-3 text-xs font-medium text-brandcolor-textstrong" onClick={() => setShowAllLayouts((value) => !value)}>
                {showAllLayouts ? 'See less' : `See more (${layouts.length - 6})`}
              </button>
            ) : null}
          </>
        )}
      </section>
      <CatalogDetailModal
        open={modal.open}
        card={modal.selectedCard}
        onClose={modal.closeCard}
        onSelectCard={modal.openCard}
      />
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="aspect-[278/209] animate-pulse rounded-xl bg-brandcolor-neutralhover" />
      ))}
    </div>
  )
}
