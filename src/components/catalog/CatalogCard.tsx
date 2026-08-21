import { Link } from 'react-router-dom'
import type { DragEvent } from 'react'
import CatalogSourceHtmlPreview from '@/components/catalog/CatalogSourceHtmlPreview'
import {
  catalogCardDescription,
  catalogCardDisplayName,
  catalogCardSourceHtml,
  formatPublishedDateLabel,
  publicAssetUrl,
} from '@/lib/catalog-entry'
import type { CatalogCardModel } from '@/lib/canvas-types'

type Props = {
  card: CatalogCardModel
  onOpen: (card: CatalogCardModel) => void
  onDragStart?: (card: CatalogCardModel, event: DragEvent<HTMLButtonElement>) => void
}

export default function CatalogCard({ card, onOpen, onDragStart }: Props) {
  const { entry } = card
  const name = catalogCardDisplayName(card)

  return (
    <article className="group min-w-0">
      <button
        type="button"
        draggable
        onDragStart={(event) => onDragStart?.(card, event)}
        onClick={() => onOpen(card)}
        className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-brandcolor-strokeweak bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-token focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brandcolor-primary focus-visible:ring-offset-2"
        aria-label={`Open ${name}`}
      >
        <div className="aspect-[278/209] w-full overflow-hidden bg-brandcolor-fill">
          <CatalogSourceHtmlPreview
            sourceHtml={catalogCardSourceHtml(card)}
            thumbnailUrl={publicAssetUrl(entry.thumbnailPath)}
            alt={name}
            compact
          />
        </div>
        <div className="w-full border-t border-brandcolor-strokeweak px-3 py-2.5">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-medium text-brandcolor-textstrong">{name}</h3>
            {entry.sealed ? (
              <span className="rounded bg-brandcolor-neutralhover px-1.5 py-0.5 text-[10px] uppercase text-brandcolor-textweak">
                Sealed
              </span>
            ) : null}
            {card.loadError ? (
              <span className="ml-auto text-[10px] text-brandcolor-banner-warning-button">Partial data</span>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-brandcolor-textweak">
            {catalogCardDescription(card)}
          </p>
          <p className="mt-1.5 text-[10px] text-brandcolor-textweak">
            {formatPublishedDateLabel(entry.publishedAt)}
          </p>
        </div>
      </button>
    </article>
  )
}

export function CatalogEmpty({ message, to, cta }: { message: string; to?: string; cta?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-brandcolor-strokeweak bg-white px-6 py-12 text-center">
      <p className="text-sm text-brandcolor-textweak">{message}</p>
      {to && cta ? (
        <Link to={to} className="mt-3 inline-block text-sm font-medium text-brandcolor-textstrong">
          {cta}
        </Link>
      ) : null}
    </div>
  )
}
