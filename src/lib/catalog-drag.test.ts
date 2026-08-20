// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { catalogDragPayload, CATALOG_DRAG_MIME, readCatalogDrag, writeCatalogDrag } from '@/lib/catalog-drag'
import type { CatalogCardModel, CatalogEntry } from '@/lib/canvas-types'

const card: CatalogCardModel = {
  entry: {
    componentId: 'canvas:card:1',
    id: 'canvas:card:1',
    label: 'Product card',
    sourceHtml: '<article>Product</article>',
    kind: 'component',
    blueprint: {},
  } satisfies CatalogEntry,
  blueprint: null,
}

describe('catalog drag payload', () => {
  it('writes and reads the catalog mime payload', () => {
    const store = new Map<string, string>()
    const transfer = {
      setData: (type: string, value: string) => {
        store.set(type, value)
      },
      getData: (type: string) => store.get(type) ?? '',
      effectAllowed: 'none',
    }
    writeCatalogDrag({ dataTransfer: transfer as unknown as DataTransfer }, card)
    expect(store.get(CATALOG_DRAG_MIME)).toContain('Product card')
    expect(catalogDragPayload(card).catalogId).toBe('canvas:card:1')
    expect(
      readCatalogDrag({ dataTransfer: transfer as unknown as DataTransfer })?.label,
    ).toBe('Product card')
  })
})
