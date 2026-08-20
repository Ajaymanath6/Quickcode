import CatalogDetailModal from '@/components/catalog/CatalogDetailModal'
import CatalogGrid from '@/components/catalog/CatalogGrid'
import CatalogSearchFilters from '@/components/catalog/CatalogSearchFilters'
import { CatalogEmpty } from '@/components/catalog/CatalogCard'
import { useCatalogCards } from '@/context/CatalogContext'
import { useCatalogModal } from '@/hooks/useCatalogModal'
import { useCatalogSearch } from '@/hooks/useCatalogSearch'
import { writeCatalogDrag } from '@/lib/catalog-drag'
import { isLayoutEntry } from '@/lib/catalog-entry'

type Props = {
  title: string
  subtitle: string
  mode: 'components' | 'layouts' | 'bookmarks'
}

export default function CatalogCollectionPage({ title, subtitle, mode }: Props) {
  const { cards, loading, error, bookmarks } = useCatalogCards()
  const scopedCards = cards.filter((card) => {
    if (mode === 'bookmarks') {
      return bookmarks.has(card.entry.id ?? card.entry.componentId)
    }
    return mode === 'layouts' ? isLayoutEntry(card.entry) : !isLayoutEntry(card.entry)
  })
  const search = useCatalogSearch(scopedCards, bookmarks)
  const modal = useCatalogModal(cards)

  if (error) {
    return <p className="p-6 text-sm text-brandcolor-warning">{error}</p>
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-6">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-brandcolor-500">
          {search.filteredCards.length} {subtitle}
        </p>
      </div>
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
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="aspect-[278/209] animate-pulse rounded-xl bg-brandcolor-100" />
          ))}
        </div>
      ) : search.filteredCards.length === 0 ? (
        <CatalogEmpty
          message={
            mode === 'bookmarks'
              ? 'No bookmarked catalog items yet.'
              : mode === 'layouts'
                ? 'No layouts in the catalog yet.'
                : 'No published components yet.'
          }
          to={mode === 'bookmarks' ? '/catalog/home' : '/admin/canvas'}
          cta={mode === 'bookmarks' ? 'Browse library' : 'Open canvas'}
        />
      ) : (
        <CatalogGrid
          cards={search.filteredCards}
          onOpen={modal.openCard}
          onDragStart={(card, event) => writeCatalogDrag(event, card)}
        />
      )}
      <CatalogDetailModal
        open={modal.open}
        card={modal.selectedCard}
        onClose={modal.closeCard}
        onSelectCard={modal.openCard}
      />
    </div>
  )
}
