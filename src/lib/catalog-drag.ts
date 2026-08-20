import type { CatalogCardModel } from '@/lib/canvas-types'
import { catalogCardDisplayName, catalogCardSourceHtml } from '@/lib/catalog-entry'

export const CATALOG_DRAG_MIME = 'application/x-quickcode-catalog-card'

export type CatalogDragPayload = {
  catalogId: string
  label: string
  sourceHtml: string
}

export function catalogDragPayload(card: CatalogCardModel): CatalogDragPayload {
  return {
    catalogId: card.entry.id ?? card.entry.componentId,
    label: catalogCardDisplayName(card),
    sourceHtml: catalogCardSourceHtml(card),
  }
}

type DragLike = {
  dataTransfer: DataTransfer | null
}

export function writeCatalogDrag(event: DragLike, card: CatalogCardModel): void {
  event.dataTransfer?.setData(CATALOG_DRAG_MIME, JSON.stringify(catalogDragPayload(card)))
  event.dataTransfer?.setData('text/plain', catalogCardDisplayName(card))
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
  }
}

export function readCatalogDrag(event: DragLike): CatalogDragPayload | null {
  try {
    const raw = event.dataTransfer?.getData(CATALOG_DRAG_MIME)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CatalogDragPayload>
    if (!parsed.catalogId || !parsed.label || typeof parsed.sourceHtml !== 'string') return null
    return parsed as CatalogDragPayload
  } catch {
    return null
  }
}
