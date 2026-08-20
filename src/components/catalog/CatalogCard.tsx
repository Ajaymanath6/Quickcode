import { Link } from 'react-router-dom'
import { catalogDisplayName } from '@/lib/catalog-entry'
import { sanitizeCanvasHtml } from '@/lib/sanitize-canvas-html'
import type { CatalogEntry } from '@/lib/canvas-types'

export default function CatalogCard({ entry }: { entry: CatalogEntry }) {
  const name = catalogDisplayName(entry)
  const date = entry.publishedAt
    ? new Date(entry.publishedAt).toLocaleDateString()
    : 'Saved locally'

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-brandcolor-200 bg-white shadow-sm">
      <div
        className="min-h-[88px] bg-brandcolor-50 p-3 text-sm"
        dangerouslySetInnerHTML={{ __html: sanitizeCanvasHtml(entry.sourceHtml || '') }}
      />
      <div className="border-t border-brandcolor-200 px-3 py-2">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-medium text-brandcolor-900">{name}</h3>
          {entry.sealed ? (
            <span className="rounded bg-brandcolor-100 px-1 text-[10px] uppercase text-brandcolor-500">
              Sealed
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-[11px] text-brandcolor-500">{date}</p>
      </div>
    </article>
  )
}

export function CatalogEmpty({ message, to, cta }: { message: string; to?: string; cta?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-brandcolor-200 bg-white px-6 py-12 text-center">
      <p className="text-sm text-brandcolor-500">{message}</p>
      {to && cta ? (
        <Link to={to} className="mt-3 inline-block text-sm font-medium text-brandcolor-700">
          {cta}
        </Link>
      ) : null}
    </div>
  )
}
