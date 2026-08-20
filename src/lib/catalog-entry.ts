import type { BlueprintDocument, CatalogCardModel, CatalogEntry } from '@/lib/canvas-types'

export function isLayoutEntry(entry: CatalogEntry): boolean {
  const id = entry.id ?? entry.componentId
  return entry.kind === 'layout' || entry.isLayout === true || id.startsWith('layout-')
}

export function catalogDisplayName(entry: CatalogEntry): string {
  return entry.name || entry.label || entry.componentId
}

export function normalizeCatalogEntry(raw: CatalogEntry): CatalogEntry {
  const kind = raw.kind === 'layout' || raw.isLayout ? 'layout' : 'component'
  const id = raw.id ?? raw.componentId
  return {
    ...raw,
    id,
    componentId: raw.componentId || id,
    name: raw.name || raw.label,
    label: raw.label || raw.name || id,
    kind,
    hasBlueprint: raw.hasBlueprint ?? Boolean(raw.blueprint),
    isLayout: kind === 'layout',
  }
}

export function catalogCardDisplayName(card: CatalogCardModel): string {
  return catalogDisplayName(card.entry)
}

export function catalogCardSourceHtml(card: CatalogCardModel): string {
  if (card.entry.sourceHtml?.trim()) {
    return card.entry.sourceHtml
  }
  const source = card.blueprint?.sourceHtml
  return typeof source === 'string' ? source : ''
}

export function catalogCardDescription(
  card: CatalogCardModel,
  fallback = 'Published catalog item.',
): string {
  if (card.entry.description?.trim()) {
    return card.entry.description
  }
  const description = card.blueprint?.description
  return typeof description === 'string' && description.trim() ? description : fallback
}

export function formatPublishedDateLabel(publishedAt?: string): string {
  if (!publishedAt) {
    return 'Saved locally'
  }
  const date = new Date(publishedAt)
  if (Number.isNaN(date.getTime())) {
    return 'Published date unavailable'
  }
  return `Created on ${new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)}`
}

export function publicAssetUrl(path?: string): string | undefined {
  if (!path) {
    return undefined
  }
  if (/^(https?:|data:|blob:)/.test(path)) {
    return path
  }
  return `/${path.replace(/^\/+/, '').replace(/^public\//, '')}`
}

export function blueprintFromEntry(entry: CatalogEntry): BlueprintDocument | null {
  return entry.blueprint && Object.keys(entry.blueprint).length > 0 ? entry.blueprint : null
}

export function catalogCardMatches(card: CatalogCardModel, query: string): boolean {
  const needle = query.trim().toLocaleLowerCase()
  if (!needle) {
    return true
  }
  return [
    catalogCardDisplayName(card),
    catalogCardDescription(card, ''),
    card.entry.id,
    card.entry.componentId,
  ].some((value) => value?.toLocaleLowerCase().includes(needle))
}

export function layoutReferencesCatalogId(blueprint: BlueprintDocument | null, id: string): boolean {
  if (!blueprint) {
    return false
  }
  return JSON.stringify(blueprint).includes(id)
}
