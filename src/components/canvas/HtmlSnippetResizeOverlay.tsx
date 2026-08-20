import type { PointerEvent } from 'react'
import {
  cursorForResizeEdge,
  type ResizeEdge,
} from '@/lib/html-snippet-resize-rect'

const EDGES: { edge: ResizeEdge; className: string }[] = [
  { edge: 'n', className: 'absolute inset-x-0 -top-1 h-3' },
  { edge: 's', className: 'absolute inset-x-0 -bottom-1 h-3' },
  { edge: 'e', className: 'absolute inset-y-0 -right-1 w-3' },
  { edge: 'w', className: 'absolute inset-y-0 -left-1 w-3' },
  { edge: 'nw', className: 'absolute -left-1 -top-1 size-3' },
  { edge: 'ne', className: 'absolute -right-1 -top-1 size-3' },
  { edge: 'sw', className: 'absolute -bottom-1 -left-1 size-3' },
  { edge: 'se', className: 'absolute -bottom-1 -right-1 size-3' },
]

type HtmlSnippetResizeOverlayProps = {
  onResizeStart: (edge: ResizeEdge, event: PointerEvent<HTMLDivElement>) => void
}

export default function HtmlSnippetResizeOverlay({
  onResizeStart,
}: HtmlSnippetResizeOverlayProps) {
  return (
    <>
      {EDGES.map(({ edge, className }) => (
        <div
          key={edge}
          className={className}
          style={{ cursor: cursorForResizeEdge(edge) }}
          onPointerDown={(event) => {
            event.stopPropagation()
            onResizeStart(edge, event)
          }}
        />
      ))}
    </>
  )
}
