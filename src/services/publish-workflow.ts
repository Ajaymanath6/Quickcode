import type { CatalogEntry, CatalogKind } from '@/lib/canvas-types'
import {
  blueprintForNode,
  buildSourceHtmlForCanvasNode,
  catalogIdForNode,
} from '@/lib/canvas-node-publish'
import type { CanvasNode } from '@/lib/canvas-types'
import { normalizeCatalogEntry } from '@/lib/catalog-entry'

const CATALOG_KEY = 'quickcode.canvas.catalog'

function readCatalog(): CatalogEntry[] {
  try {
    const raw = localStorage.getItem(CATALOG_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return (parsed as CatalogEntry[]).map(normalizeCatalogEntry)
  } catch {
    return []
  }
}

function writeCatalog(entries: CatalogEntry[]): void {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(entries.map(normalizeCatalogEntry)))
}

export type PublishPayload = {
  componentId: string
  label: string
  sourceHtml: string
  description?: string
  sealed?: boolean
  kind: CatalogKind
  blueprint: Record<string, unknown>
}

export async function fetchCatalogIndex(): Promise<CatalogEntry[]> {
  await delay(40)
  return readCatalog()
}

export async function publishToCatalog(payload: PublishPayload): Promise<{
  componentId: string
}> {
  await delay(80)
  const entries = readCatalog()
  const next = normalizeCatalogEntry({
    componentId: payload.componentId,
    id: payload.componentId,
    label: payload.label,
    name: payload.label,
    sourceHtml: payload.sourceHtml,
    description: payload.description,
    sealed: payload.sealed,
    kind: payload.kind,
    blueprint: payload.blueprint,
    hasBlueprint: true,
    blueprintPath: `blueprints/${payload.componentId}.json`,
    publishedAt: new Date().toISOString(),
    isLayout: payload.kind === 'layout',
  })
  const index = entries.findIndex((entry) => entry.componentId === payload.componentId)
  if (index >= 0) {
    entries[index] = { ...entries[index], ...next, publishedAt: next.publishedAt }
  } else {
    entries.push(next)
  }
  writeCatalog(entries)
  return { componentId: payload.componentId }
}

export async function deleteCatalogEntry(componentId: string): Promise<void> {
  await delay(40)
  writeCatalog(readCatalog().filter((entry) => entry.componentId !== componentId))
}

export async function publishCanvasNode(
  node: CanvasNode,
  options: { label: string; description?: string; sealed?: boolean },
): Promise<{ componentId: string }> {
  const componentId = catalogIdForNode(node)
  return publishToCatalog({
    componentId,
    label: options.label,
    sourceHtml: buildSourceHtmlForCanvasNode(node),
    description: options.description,
    sealed: options.sealed,
    kind: 'component',
    blueprint: blueprintForNode(node),
  })
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
