import type { CatalogEntry } from '@/lib/canvas-types'

export function isLayoutEntry(entry: CatalogEntry): boolean {
  return entry.kind === 'layout' || entry.isLayout === true
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
