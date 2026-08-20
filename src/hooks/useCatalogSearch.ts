import { useEffect, useMemo, useState } from 'react'
import { catalogCardMatches } from '@/lib/catalog-entry'
import type { CatalogCardModel } from '@/lib/canvas-types'

const SEARCH_KEY = 'quickcode.catalog.search'

export function useCatalogSearch(cards: CatalogCardModel[], bookmarks: Set<string>) {
  const [query, setQuery] = useState(() => sessionStorage.getItem(SEARCH_KEY) ?? '')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const [sealedOnly, setSealedOnly] = useState(false)
  const [recentOnly, setRecentOnly] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query)
      sessionStorage.setItem(SEARCH_KEY, query)
    }, 180)
    return () => window.clearTimeout(timeout)
  }, [query])

  const [now] = useState(() => Date.now())
  const filteredCards = useMemo(() => {
    const recentThreshold = now - 30 * 24 * 60 * 60 * 1000
    return cards.filter((card) => {
      if (!catalogCardMatches(card, debouncedQuery)) return false
      const id = card.entry.id ?? card.entry.componentId
      if (bookmarkedOnly && !bookmarks.has(id)) return false
      if (sealedOnly && !card.entry.sealed) return false
      if (recentOnly) {
        const date = card.entry.publishedAt ? new Date(card.entry.publishedAt).getTime() : 0
        if (!date || date < recentThreshold) return false
      }
      return true
    })
  }, [bookmarkedOnly, bookmarks, cards, debouncedQuery, recentOnly, sealedOnly])

  return {
    query,
    setQuery,
    bookmarkedOnly,
    setBookmarkedOnly,
    sealedOnly,
    setSealedOnly,
    recentOnly,
    setRecentOnly,
    filteredCards,
  }
}
