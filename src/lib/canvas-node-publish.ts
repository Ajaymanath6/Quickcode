import type { CanvasNode, CatalogEntry } from '@/lib/canvas-types'
import { isLayoutEntry } from '@/lib/catalog-entry'

export function catalogIdForNode(node: CanvasNode): string {
  return `canvas:${node.kind}:${node.id}`
}

export function isPublishedCatalogEntry(entry: CatalogEntry | undefined): boolean {
  if (!entry) {
    return false
  }
  return !isLayoutEntry(entry)
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function buildSourceHtmlForCanvasNode(node: CanvasNode): string {
  switch (node.kind) {
    case 'card':
      return `<article class="rounded-xl border border-brandcolor-200 bg-white p-4 shadow-sm">
  <p class="text-xs text-brandcolor-500">${escapeHtml(node.subtitle)}</p>
  <h3 class="mt-1 text-base font-semibold text-brandcolor-900">${escapeHtml(node.title)}</h3>
  <p class="mt-2 text-sm text-brandcolor-700">${escapeHtml(node.body)}</p>
</article>`
    case 'primaryButton':
      return `<button type="button" class="rounded-md bg-brandcolor-700 px-4 py-2 text-sm font-medium text-white">${escapeHtml(node.label)}</button>`
    case 'secondaryButton':
      return `<button type="button" class="rounded-md border border-brandcolor-700 px-4 py-2 text-sm font-medium text-brandcolor-700">${escapeHtml(node.label)}</button>`
    case 'neutralButton':
      return `<button type="button" class="rounded-md bg-brandcolor-100 px-4 py-2 text-sm font-medium text-brandcolor-700">${escapeHtml(node.label)}</button>`
    case 'confirmPasswordInput':
      return `<label class="block text-sm text-brandcolor-700">${escapeHtml(node.label)}
  <input type="password" class="mt-1 w-full rounded-md border border-brandcolor-200 px-3 py-2" />
</label>`
    case 'textInputField':
      return `<label class="block text-sm text-brandcolor-700">${escapeHtml(node.label)}
  <input type="text" class="mt-1 w-full rounded-md border border-brandcolor-200 px-3 py-2" />
</label>`
    case 'productSidebar':
      return `<aside class="w-56 rounded-xl border border-brandcolor-200 bg-white p-3">
  <div class="flex items-center justify-between text-sm font-semibold">${escapeHtml(node.title)}</div>
  <input class="mt-3 w-full rounded-md border border-brandcolor-200 px-2 py-1 text-sm" placeholder="${escapeHtml(node.searchPlaceholder)}" />
  <button type="button" class="mt-2 w-full rounded-md bg-brandcolor-100 px-2 py-1 text-sm">${escapeHtml(node.neutralButtonLabel)}</button>
</aside>`
    case 'htmlSnippet':
      return node.html
    default: {
      const _never: never = node
      return _never
    }
  }
}

export function applyDisplayName(node: CanvasNode, label: string): CanvasNode {
  switch (node.kind) {
    case 'card':
    case 'productSidebar':
      return { ...node, title: label }
    case 'htmlSnippet':
    case 'primaryButton':
    case 'secondaryButton':
    case 'neutralButton':
    case 'confirmPasswordInput':
    case 'textInputField':
      return { ...node, label }
    default: {
      const _never: never = node
      return _never
    }
  }
}

export function blueprintForNode(node: CanvasNode): Record<string, unknown> {
  return { ...node }
}
