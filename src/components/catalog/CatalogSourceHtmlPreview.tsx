import { sanitizeCanvasHtml } from '@/lib/sanitize-canvas-html'

type Props = {
  sourceHtml: string
  thumbnailUrl?: string
  alt: string
  compact?: boolean
}

export default function CatalogSourceHtmlPreview({
  sourceHtml,
  thumbnailUrl,
  alt,
  compact = false,
}: Props) {
  if (sourceHtml.trim()) {
    return (
      <div
        className={`catalog-html-preview h-full w-full overflow-auto bg-white ${
          compact ? 'pointer-events-none select-none p-3' : 'p-6'
        }`}
        aria-label={`${alt} preview`}
        dangerouslySetInnerHTML={{ __html: sanitizeCanvasHtml(sourceHtml) }}
      />
    )
  }

  if (thumbnailUrl) {
    return <img src={thumbnailUrl} alt={alt} className="h-full w-full object-contain" />
  }

  return (
    <div className="flex h-full min-h-28 items-center justify-center text-xs text-brandcolor-500">
      No preview
    </div>
  )
}
