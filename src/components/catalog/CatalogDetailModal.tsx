import { useEffect, useMemo, useRef, useState } from 'react'
import {
  RiBookmarkFill,
  RiBookmarkLine,
  RiBracesLine,
  RiCloseLine,
  RiCodeLine,
  RiDeleteBinLine,
  RiEditLine,
  RiFileCopyLine,
  RiRefreshLine,
  RiShareBoxLine,
} from '@remixicon/react'
import { useNavigate } from 'react-router-dom'
import CatalogSourceHtmlPreview from '@/components/catalog/CatalogSourceHtmlPreview'
import { useCatalogCards } from '@/context/CatalogContext'
import { addCatalogCardToBoard, pruneCatalogNodeFromBoard } from '@/lib/canvas-board-storage'
import {
  catalogCardDisplayName,
  catalogCardSourceHtml,
  formatPublishedDateLabel,
  isLayoutEntry,
  layoutReferencesCatalogId,
  publicAssetUrl,
} from '@/lib/catalog-entry'
import type { CatalogCardModel } from '@/lib/canvas-types'
import {
  deleteCatalogEntry,
  publishToCatalog,
} from '@/services/publish-workflow'

type DetailPanel = 'image' | 'code' | 'blueprint'

type Props = {
  open: boolean
  card: CatalogCardModel | null
  onClose: () => void
  onSelectCard: (card: CatalogCardModel) => void
}

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

export default function CatalogDetailModal({ open, card, onClose, onSelectCard }: Props) {
  const navigate = useNavigate()
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const {
    cards,
    bookmarks,
    refreshing,
    refreshCatalog,
    toggleBookmark,
    removeBookmark,
  } = useCatalogCards()
  const [panel, setPanel] = useState<DetailPanel>('image')
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sealed, setSealed] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const id = card?.entry.id ?? card?.entry.componentId ?? ''
  const displayName = card ? catalogCardDisplayName(card) : ''
  const sourceHtml = card ? catalogCardSourceHtml(card) : ''
  const isBookmarked = bookmarks.has(id)
  const relatedLayouts = useMemo(
    () =>
      card
        ? cards.filter(
            (candidate) =>
              candidate.entry.componentId !== card.entry.componentId &&
              isLayoutEntry(candidate.entry) &&
              layoutReferencesCatalogId(candidate.blueprint, id),
          )
        : [],
    [card, cards, id],
  )

  useEffect(() => {
    if (!open || !card) {
      return
    }
    setPanel('image')
    setEditing(false)
    setNotice(null)
    setName(displayName)
    setDescription(card.entry.description ?? '')
    setSealed(Boolean(card.entry.sealed))
    // Reset preview only when the selected catalog id changes, not on refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.entry.componentId, open])

  useEffect(() => {
    if (!open) {
      return
    }
    previousFocusRef.current = document.activeElement as HTMLElement | null
    const frame = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    })
    return () => {
      window.cancelAnimationFrame(frame)
      previousFocusRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])]
        if (focusable.length === 0) {
          return
        }
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
        return
      }
      if (busy || editing || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }
      if (event.key === 'Escape') onClose()
      if (event.key === '1') setPanel('image')
      if (event.key === '2') setPanel('code')
      if (event.key === '3') setPanel('blueprint')
      if (event.key.toLowerCase() === 'b') toggleBookmark(id)
      if (event.key.toLowerCase() === 'r') void refreshCatalog()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [busy, editing, id, onClose, open, refreshCatalog, toggleBookmark])

  if (!open || !card) {
    return null
  }

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setNotice(`${label} copied.`)
    } catch {
      setNotice(`Could not copy ${label.toLowerCase()}.`)
    }
  }

  const ensureSealedOverride = (): boolean =>
    !card.entry.sealed ||
    window.confirm('This item is sealed. Continue with an admin override?')

  const saveDetails = async () => {
    if (!name.trim() || !ensureSealedOverride()) {
      return
    }
    setBusy(true)
    try {
      await publishToCatalog({
        componentId: card.entry.componentId,
        label: name.trim(),
        sourceHtml,
        description: description.trim() || undefined,
        sealed,
        kind: isLayoutEntry(card.entry) ? 'layout' : 'component',
        blueprint: card.entry.blueprint,
      })
      await refreshCatalog()
      setEditing(false)
      setNotice('Catalog details updated.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!ensureSealedOverride()) {
      return
    }
    const layout = isLayoutEntry(card.entry)
    const prompt = layout
      ? `Delete layout “${displayName}” from the catalog?`
      : `Permanently delete component “${displayName}” from the catalog?`
    if (!window.confirm(prompt)) {
      return
    }
    const prune = !layout && window.confirm('Also remove its matching node from the canvas?')
    setBusy(true)
    try {
      await deleteCatalogEntry(card.entry.componentId)
      if (prune) {
        pruneCatalogNodeFromBoard(id)
      }
      removeBookmark(id)
      await refreshCatalog()
      onClose()
    } finally {
      setBusy(false)
    }
  }

  const openOnCanvas = () => {
    const result = addCatalogCardToBoard(card)
    navigate(`/admin/canvas?focus=${encodeURIComponent(result.nodeId)}`)
  }

  const toolbarButton =
    'inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-brandcolor-700 hover:bg-brandcolor-100 disabled:opacity-50'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brandcolor-900/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-detail-title"
        className="relative flex h-[min(70vh,760px)] w-[min(60vw,1040px)] min-w-[680px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-brandcolor-200 bg-white shadow-lg"
      >
        <header className="flex shrink-0 items-start gap-4 border-b border-brandcolor-200 px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 id="catalog-detail-title" className="truncate text-base font-semibold">
                {displayName}
              </h2>
              {card.entry.sealed ? (
                <span className="rounded bg-brandcolor-100 px-1.5 py-0.5 text-[10px] uppercase text-brandcolor-500">
                  Sealed
                </span>
              ) : null}
            </div>
            <p className="text-xs text-brandcolor-500">
              {formatPublishedDateLabel(card.entry.publishedAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-0.5">
            <button className={toolbarButton} disabled={refreshing} onClick={() => void refreshCatalog()}>
              <RiRefreshLine className={`size-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              className={toolbarButton}
              aria-pressed={isBookmarked}
              onClick={() => toggleBookmark(id)}
            >
              {isBookmarked ? <RiBookmarkFill className="size-4" /> : <RiBookmarkLine className="size-4" />}
              Bookmark
            </button>
            <button
              className={toolbarButton}
              aria-pressed={panel === 'code'}
              onClick={() => setPanel((value) => (value === 'code' ? 'image' : 'code'))}
            >
              <RiCodeLine className="size-4" /> Code
            </button>
            <button
              className={toolbarButton}
              aria-pressed={panel === 'blueprint'}
              onClick={() => setPanel((value) => (value === 'blueprint' ? 'image' : 'blueprint'))}
            >
              <RiBracesLine className="size-4" /> JSON
            </button>
            <button className={toolbarButton} onClick={() => setEditing((value) => !value)}>
              <RiEditLine className="size-4" /> Edit
            </button>
            <button className={`${toolbarButton} text-red-700`} disabled={busy} onClick={() => void remove()}>
              <RiDeleteBinLine className="size-4" /> Delete
            </button>
            <button className={toolbarButton} aria-label="Close" disabled={busy} onClick={onClose}>
              <RiCloseLine className="size-5" />
            </button>
          </div>
        </header>

        {editing ? (
          <div className="grid shrink-0 gap-3 border-b border-brandcolor-200 bg-brandcolor-50 p-4 sm:grid-cols-2">
            <label className="text-xs font-medium">
              Display name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-md border border-brandcolor-200 bg-white px-3 py-2 font-normal"
              />
            </label>
            <label className="text-xs font-medium">
              Description
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-1 w-full rounded-md border border-brandcolor-200 bg-white px-3 py-2 font-normal"
              />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={sealed} onChange={(event) => setSealed(event.target.checked)} />
              Sealed
            </label>
            <div className="flex justify-end gap-2">
              <button className={toolbarButton} onClick={() => setEditing(false)}>Cancel</button>
              <button
                className="rounded-md bg-brandcolor-700 px-3 py-1.5 text-xs text-white disabled:opacity-50"
                disabled={busy || !name.trim()}
                onClick={() => void saveDetails()}
              >
                Save details
              </button>
            </div>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-auto bg-brandcolor-50 p-4">
          {panel === 'image' ? (
            <div className="h-full min-h-64 overflow-auto rounded-xl border border-brandcolor-200 bg-white">
              <CatalogSourceHtmlPreview
                sourceHtml={sourceHtml}
                thumbnailUrl={publicAssetUrl(card.entry.thumbnailPath)}
                alt={displayName}
              />
            </div>
          ) : null}
          {panel === 'code' ? (
            <div className="relative h-full">
              <button className="absolute right-3 top-3 z-10 rounded-md bg-white px-2 py-1 text-xs shadow" onClick={() => void copy(sourceHtml, 'HTML')}>
                <RiFileCopyLine className="mr-1 inline size-4" /> Copy HTML
              </button>
              <pre className="h-full min-h-64 whitespace-pre-wrap break-words rounded-xl border border-brandcolor-200 bg-white p-4 pr-28 text-xs text-brandcolor-900">
                {sourceHtml || 'No source HTML stored for this entry.'}
              </pre>
            </div>
          ) : null}
          {panel === 'blueprint' ? (
            <div className="relative h-full">
              <button className="absolute right-3 top-3 z-10 rounded-md bg-white px-2 py-1 text-xs shadow" onClick={() => void copy(JSON.stringify(card.blueprint, null, 2), 'JSON')}>
                <RiFileCopyLine className="mr-1 inline size-4" /> Copy JSON
              </button>
              <pre className="h-full min-h-64 whitespace-pre-wrap break-words rounded-xl border border-brandcolor-200 bg-white p-4 pr-28 text-xs text-brandcolor-900">
                {card.loadError
                  ? `${card.loadError}\n\n${JSON.stringify(card.blueprint, null, 2)}`
                  : JSON.stringify(card.blueprint, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>

        <footer className="flex shrink-0 items-center gap-2 border-t border-brandcolor-200 px-4 py-2.5">
          <button className={toolbarButton} onClick={openOnCanvas}>
            <RiShareBoxLine className="size-4" /> Open on canvas
          </button>
          <button className={toolbarButton} onClick={() => void copy(displayName, 'Published name')}>
            <RiFileCopyLine className="size-4" /> Copy for extension
          </button>
          <button className={toolbarButton} onClick={() => void copy(id, 'Component id')}>
            Copy id
          </button>
          <span className="text-[11px] text-brandcolor-500">
            Use the exact published name in “A2UI: Generate Component from Prompt”.
          </span>
          <span className="ml-auto text-[11px] text-brandcolor-500">
            Version: {card.entry.publishedAt ? 'current publish' : 'local'} · History unavailable
          </span>
        </footer>
        {relatedLayouts.length > 0 ? (
          <div className="flex shrink-0 items-center gap-2 border-t border-brandcolor-200 px-4 py-2 text-xs">
            <span className="text-brandcolor-500">Used in layouts:</span>
            {relatedLayouts.map((layout) => (
              <button
                key={layout.entry.componentId}
                className="text-brandcolor-700 underline"
                onClick={() => onSelectCard(layout)}
              >
                {catalogCardDisplayName(layout)}
              </button>
            ))}
          </div>
        ) : null}
        {notice ? (
          <div role="status" className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-brandcolor-900 px-3 py-2 text-xs text-white shadow-lg">
            {notice}
          </div>
        ) : null}
      </div>
    </div>
  )
}
