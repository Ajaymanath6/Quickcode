import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import {
  readCatalogBookmarks,
  removeCatalogBookmark,
  toggleCatalogBookmark,
} from '@/lib/catalog-bookmarks'
import { publicAssetUrl } from '@/lib/catalog-entry'
import type { BlueprintDocument, CatalogCardModel, CatalogEntry } from '@/lib/canvas-types'
import { fetchCatalogIndex } from '@/services/publish-workflow'

type CatalogContextValue = {
  cards: CatalogCardModel[]
  loading: boolean
  error: string | null
  refreshing: boolean
  bookmarks: Set<string>
  refreshCatalog: () => Promise<void>
  toggleBookmark: (id: string) => void
  removeBookmark: (id: string) => void
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

async function loadBlueprint(entry: CatalogEntry): Promise<CatalogCardModel> {
  const url = publicAssetUrl(entry.blueprintPath)
  if (!url) {
    return {
      entry,
      blueprint: entry.blueprint as BlueprintDocument,
    }
  }
  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`Blueprint request failed (${response.status})`)
    }
    return {
      entry,
      blueprint: (await response.json()) as BlueprintDocument,
    }
  } catch (error) {
    return {
      entry,
      blueprint: entry.blueprint as BlueprintDocument,
      loadError: error instanceof Error ? error.message : 'Blueprint could not be loaded.',
    }
  }
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<CatalogCardModel[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookmarks, setBookmarks] = useState<Set<string>>(readCatalogBookmarks)

  const refreshCatalog = useCallback(async () => {
    setRefreshing(true)
    try {
      const entries = await fetchCatalogIndex()
      setCards(await Promise.all(entries.map(loadBlueprint)))
      setError(null)
    } catch {
      setError('Could not load the catalog. Keep npm run dev:with-llm running and try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void refreshCatalog()
  }, [refreshCatalog])

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(toggleCatalogBookmark(id))
  }, [])

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(removeCatalogBookmark(id))
  }, [])

  const value = useMemo(
    () => ({
      cards,
      loading,
      error,
      refreshing,
      bookmarks,
      refreshCatalog,
      toggleBookmark,
      removeBookmark,
    }),
    [bookmarks, cards, error, loading, refreshCatalog, refreshing, removeBookmark, toggleBookmark],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalogCards(): CatalogContextValue {
  const value = useContext(CatalogContext)
  if (!value) {
    throw new Error('useCatalogCards must be used within CatalogProvider')
  }
  return value
}
