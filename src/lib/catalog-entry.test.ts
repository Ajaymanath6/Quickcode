// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import {
  catalogCardMatches,
  catalogCardSourceHtml,
  formatPublishedDateLabel,
  isLayoutEntry,
  layoutReferencesCatalogId,
  publicAssetUrl,
} from '@/lib/catalog-entry'
import {
  readCatalogBookmarks,
  removeCatalogBookmark,
  toggleCatalogBookmark,
} from '@/lib/catalog-bookmarks'
import type { CatalogCardModel, CatalogEntry } from '@/lib/canvas-types'

const entry: CatalogEntry = {
  componentId: 'canvas:card:1',
  label: 'Product card',
  sourceHtml: '<article>Product</article>',
  description: 'A compact commerce card',
  kind: 'component',
  blueprint: {},
}

const card: CatalogCardModel = { entry, blueprint: null }

describe('catalog helpers', () => {
  it('splits layouts by kind or id prefix', () => {
    expect(isLayoutEntry({ ...entry, kind: 'layout' })).toBe(true)
    expect(isLayoutEntry({ ...entry, componentId: 'layout-dashboard' })).toBe(true)
    expect(isLayoutEntry(entry)).toBe(false)
  })

  it('resolves source, public paths, dates, and search text', () => {
    expect(catalogCardSourceHtml(card)).toContain('Product')
    expect(publicAssetUrl('public/blueprints/card.json')).toBe('/blueprints/card.json')
    expect(formatPublishedDateLabel('2026-07-05T00:00:00Z')).toContain('2026')
    expect(catalogCardMatches(card, 'commerce')).toBe(true)
    expect(catalogCardMatches(card, 'missing')).toBe(false)
  })

  it('detects related layout references', () => {
    expect(
      layoutReferencesCatalogId(
        { blocks: [{ componentId: 'canvas:card:1' }] },
        'canvas:card:1',
      ),
    ).toBe(true)
    expect(layoutReferencesCatalogId({ blocks: [] }, 'canvas:card:1')).toBe(false)
  })
})

describe('catalog bookmarks', () => {
  beforeEach(() => localStorage.clear())

  it('persists toggle and removal', () => {
    expect(toggleCatalogBookmark(entry.componentId).has(entry.componentId)).toBe(true)
    expect(readCatalogBookmarks().has(entry.componentId)).toBe(true)
    expect(removeCatalogBookmark(entry.componentId).has(entry.componentId)).toBe(false)
  })
})
