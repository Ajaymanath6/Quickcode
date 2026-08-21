import { useEffect, useRef } from 'react'
import type { PointerEvent, RefObject } from 'react'
import {
  RiDeleteBinLine,
  RiCodeSSlashLine,
  RiCameraLine,
  RiHomeLine,
  RiSettings3Line,
  RiMoreLine,
} from '@remixicon/react'
import { useCanvasChrome } from '@/context/CanvasChromeContext'
import type { CanvasNode } from '@/lib/canvas-types'
import { nodeSize } from '@/lib/canvas-node-size'
import { sanitizeCanvasHtml } from '@/lib/sanitize-canvas-html'
import type { ResizeEdge } from '@/lib/html-snippet-resize-rect'
import HtmlSnippetResizeOverlay from '@/components/canvas/HtmlSnippetResizeOverlay'

const ICONS: Record<string, typeof RiHomeLine> = {
  home: RiHomeLine,
  settings: RiSettings3Line,
}

function kindLabel(kind: CanvasNode['kind']): string {
  switch (kind) {
    case 'card':
      return 'Card'
    case 'primaryButton':
      return 'Primary'
    case 'secondaryButton':
      return 'Secondary'
    case 'neutralButton':
      return 'Neutral'
    case 'confirmPasswordInput':
      return 'Confirm password'
    case 'textInputField':
      return 'Text input'
    case 'productSidebar':
      return 'Sidebar'
    case 'htmlSnippet':
      return 'Frame'
    default: {
      const _never: never = kind
      return _never
    }
  }
}

type CanvasWorldBlockProps = {
  node: CanvasNode
  selected: boolean
  published: boolean
  scale: number
  onSelect: () => void
  onMove: (dx: number, dy: number) => void
  onMoveEnd: () => void
  onCapture: () => void
  onCode: () => void
  onDelete: () => void
  onHtmlResizeStart: (edge: ResizeEdge, event: PointerEvent<HTMLDivElement>) => void
  onHtmlContentHeight: (height: number) => void
}

export default function CanvasWorldBlock({
  node,
  selected,
  published,
  scale,
  onSelect,
  onMove,
  onMoveEnd,
  onCapture,
  onCode,
  onDelete,
  onHtmlResizeStart,
  onHtmlContentHeight,
}: CanvasWorldBlockProps) {
  const { hideBlockChrome, tool } = useCanvasChrome()
  const size = nodeSize(node)
  const dragRef = useRef<{ x: number; y: number } | null>(null)
  const htmlBodyRef = useRef<HTMLDivElement>(null)

  const htmlMarkup = node.kind === 'htmlSnippet' ? node.html : ''

  useEffect(() => {
    if (node.kind !== 'htmlSnippet' || !htmlBodyRef.current) {
      return
    }
    const contentHeight = htmlBodyRef.current.scrollHeight
    onHtmlContentHeight(contentHeight)
  }, [htmlMarkup, node.kind, onHtmlContentHeight])

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || tool === 'frame') {
      return
    }
    event.stopPropagation()
    onSelect()
    dragRef.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) {
      return
    }
    const dx = (event.clientX - dragRef.current.x) / scale
    const dy = (event.clientY - dragRef.current.y) / scale
    dragRef.current = { x: event.clientX, y: event.clientY }
    onMove(dx, dy)
  }

  const onPointerUp = () => {
    if (dragRef.current) {
      dragRef.current = null
      onMoveEnd()
    }
  }

  const showChrome = !hideBlockChrome
  const showResize = node.kind === 'htmlSnippet' && (selected || !hideBlockChrome)

  return (
    <div
      className={`group absolute rounded-xl border bg-white shadow-sm ${
        selected ? 'border-brandcolor-primary ring-2 ring-brandcolor-primary/20' : 'border-brandcolor-strokeweak'
      }`}
      style={{
        left: node.x,
        top: node.y,
        width: size.width,
        height: size.height,
        cursor: node.kind === 'htmlSnippet' ? 'move' : 'grab',
      }}
      onPointerDown={startDrag}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {showChrome ? (
        <div
          className={`pointer-events-none absolute -top-7 left-0 flex ${
            selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <div
            className="pointer-events-auto flex items-center gap-1 rounded bg-white/95 px-1 py-0.5 text-canvas-xs text-brandcolor-textstrong shadow"
          >
            <span className="max-w-[90px] truncate">{kindLabel(node.kind)}</span>
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onCapture}
              title="Capture"
            >
              <RiCameraLine className="size-3" />
            </button>
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onCode}
              title="Code"
            >
              <RiCodeSSlashLine className="size-3" />
            </button>
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onDelete}
              title="Delete"
            >
              <RiDeleteBinLine className="size-3" />
            </button>
          </div>
        </div>
      ) : null}
      {showChrome ? (
        <span
          className={`absolute -top-2 right-2 rounded px-1 text-canvas-xs ${
            published
              ? 'bg-brandcolor-banner-warning-bg text-brandcolor-banner-warning-button'
              : 'bg-brandcolor-neutralhover text-brandcolor-textweak'
          }`}
        >
          {published ? 'Published' : 'Not published'}
        </span>
      ) : null}
      <div className="h-full overflow-hidden p-3">
        <BlockBody node={node} htmlBodyRef={htmlBodyRef} />
      </div>
      {showResize ? <HtmlSnippetResizeOverlay onResizeStart={onHtmlResizeStart} /> : null}
    </div>
  )
}

function BlockBody({
  node,
  htmlBodyRef,
}: {
  node: CanvasNode
  htmlBodyRef: RefObject<HTMLDivElement | null>
}) {
  switch (node.kind) {
    case 'card':
      return (
        <article>
          <p className="text-canvas-xs text-brandcolor-textweak">{node.subtitle}</p>
          <h3 className="mt-1 text-sm font-semibold">{node.title}</h3>
          <p className="mt-2 text-xs text-brandcolor-textstrong">{node.body}</p>
        </article>
      )
    case 'primaryButton':
      return (
        <button
          type="button"
          className="rounded-md bg-brandcolor-primary px-3 py-2 text-sm text-white"
        >
          {node.label}
        </button>
      )
    case 'secondaryButton':
      return (
        <button
          type="button"
          className="rounded-md border border-brandcolor-primary px-3 py-2 text-sm text-brandcolor-textstrong"
        >
          {node.label}
        </button>
      )
    case 'neutralButton':
      return (
        <button
          type="button"
          className="rounded-md bg-brandcolor-neutralhover px-3 py-2 text-sm text-brandcolor-textstrong"
        >
          {node.label}
        </button>
      )
    case 'confirmPasswordInput':
      return (
        <label
          className="block text-xs text-brandcolor-textstrong"
          onPointerDown={(event) => event.stopPropagation()}
        >
          {node.label}
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-brandcolor-strokeweak px-2 py-1 text-sm"
            onPointerDown={(event) => event.stopPropagation()}
          />
        </label>
      )
    case 'textInputField':
      return (
        <label
          className="block text-xs text-brandcolor-textstrong"
          onPointerDown={(event) => event.stopPropagation()}
        >
          {node.label}
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-brandcolor-strokeweak px-2 py-1 text-sm"
            onPointerDown={(event) => event.stopPropagation()}
          />
        </label>
      )
    case 'productSidebar': {
      const Trailing = ICONS[node.trailingIconKey] ?? RiMoreLine
      return (
        <aside className="flex h-full flex-col text-xs">
          <div className="flex items-center justify-between font-semibold">
            {node.title}
            <Trailing className="size-3.5" />
          </div>
          <input
            className="mt-2 rounded-md border border-brandcolor-strokeweak px-2 py-1"
            placeholder={node.searchPlaceholder}
            onPointerDown={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            className="mt-2 rounded-md bg-brandcolor-neutralhover px-2 py-1"
          >
            {node.neutralButtonLabel}
          </button>
          <nav className="mt-3 space-y-2">
            {node.navSections.map((section) => (
              <div key={section.title}>
                <p className="text-canvas-xs uppercase text-brandcolor-textweak">{section.title}</p>
                {section.items.map((item) => {
                  const Icon = ICONS[item.iconKey ?? ''] ?? RiHomeLine
                  return (
                    <div key={item.label} className="mt-1 flex items-center gap-1">
                      <Icon className="size-3" />
                      {item.label}
                    </div>
                  )
                })}
              </div>
            ))}
          </nav>
        </aside>
      )
    }
    case 'htmlSnippet':
      return (
        <div
          ref={htmlBodyRef}
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: sanitizeCanvasHtml(node.html) }}
        />
      )
    default: {
      const _never: never = node
      return _never
    }
  }
}
