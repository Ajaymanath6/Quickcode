const BOOKMARKS_KEY = 'quickcode.catalog.bookmarks'

export function readCatalogBookmarks(): Set<string> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? '[]')
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [])
  } catch {
    return new Set()
  }
}

export function writeCatalogBookmarks(bookmarks: Set<string>): void {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarks]))
}

export function toggleCatalogBookmark(id: string): Set<string> {
  const next = readCatalogBookmarks()
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  writeCatalogBookmarks(next)
  return next
}

export function removeCatalogBookmark(id: string): Set<string> {
  const next = readCatalogBookmarks()
  next.delete(id)
  writeCatalogBookmarks(next)
  return next
}
