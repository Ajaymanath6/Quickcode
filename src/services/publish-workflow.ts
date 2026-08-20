import type { CatalogEntry, CatalogKind } from '@/lib/canvas-types'
import {
  blueprintForNode,
  buildSourceHtmlForCanvasNode,
  catalogIdForNode,
} from '@/lib/canvas-node-publish'
import type { CanvasNode } from '@/lib/canvas-types'
import { normalizeCatalogEntry } from '@/lib/catalog-entry'

const CATALOG_KEY = 'quickcode.canvas.catalog'

export function readLocalCatalog(): CatalogEntry[] {
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

export function writeLocalCatalog(entries: CatalogEntry[]): void {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(entries.map(normalizeCatalogEntry)))
}

function safeBlueprintFilename(componentId: string): string {
  return `${componentId.replace(/[^a-zA-Z0-9_.-]/g, '-')}.json`
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
  try {
    const response = await fetch('/api/catalog')
    if (response.ok) {
      const parsed: unknown = await response.json()
      if (Array.isArray(parsed)) {
        return (parsed as CatalogEntry[]).map(normalizeCatalogEntry)
      }
    }
  } catch {
    // helper down
  }
  await delay(40)
  return readLocalCatalog()
}

export async function publishToCatalog(payload: PublishPayload): Promise<{
  componentId: string
}> {
  try {
    const response = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (response.ok) {
      const body = (await response.json()) as { componentId: string }
      const local = readLocalCatalog()
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
        blueprintPath: `public/blueprints/${safeBlueprintFilename(payload.componentId)}`,
        publishedAt: new Date().toISOString(),
        isLayout: payload.kind === 'layout',
      })
      const index = local.findIndex((entry) => entry.componentId === payload.componentId)
      if (index >= 0) {
        local[index] = next
      } else {
        local.push(next)
      }
      writeLocalCatalog(local)
      return { componentId: body.componentId || payload.componentId }
    }
  } catch {
    // fall through to localStorage
  }
  await delay(80)
  const entries = readLocalCatalog()
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
    blueprintPath: `blueprints/${safeBlueprintFilename(payload.componentId)}`,
    publishedAt: new Date().toISOString(),
    isLayout: payload.kind === 'layout',
  })
  const index = entries.findIndex((entry) => entry.componentId === payload.componentId)
  if (index >= 0) {
    entries[index] = { ...entries[index], ...next, publishedAt: next.publishedAt }
  } else {
    entries.push(next)
  }
  writeLocalCatalog(entries)
  return { componentId: payload.componentId }
}

export async function deleteCatalogEntry(componentId: string): Promise<void> {
  try {
    const response = await fetch(`/api/catalog/${encodeURIComponent(componentId)}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(`Catalog delete failed (${response.status})`)
    }
  } catch {
    // Keep the local fallback usable when the helper is not running.
  }
  writeLocalCatalog(
    readLocalCatalog().filter((entry) => entry.componentId !== componentId),
  )
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
