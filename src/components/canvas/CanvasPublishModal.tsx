import { useEffect, useId, useState } from 'react'
import { RiPencilLine } from '@remixicon/react'
import { sanitizeCanvasHtml } from '@/lib/sanitize-canvas-html'

type CanvasPublishModalProps = {
  open: boolean
  defaultName: string
  previewHtml: string
  busy: boolean
  error: string | null
  onClose: () => void
  onPublish: (values: { label: string; description: string; sealed: boolean }) => void
}

export default function CanvasPublishModal({
  open,
  defaultName,
  previewHtml,
  busy,
  error,
  onClose,
  onPublish,
}: CanvasPublishModalProps) {
  const nameId = useId()
  const descId = useId()
  const [label, setLabel] = useState(defaultName)
  const [editingName, setEditingName] = useState(false)
  const [description, setDescription] = useState('')
  const [sealed, setSealed] = useState(false)

  useEffect(() => {
    if (open) {
      setLabel(defaultName)
      setDescription('')
      setSealed(false)
      setEditingName(false)
    }
  }, [defaultName, open])

  useEffect(() => {
    if (!open) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onClose, open])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brandcolor-900/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-brandcolor-200 bg-white p-4 shadow-lg">
        <h2 className="text-sm font-semibold text-brandcolor-900">Publish component</h2>
        <div className="mt-3 flex items-center gap-2">
          {editingName ? (
            <input
              id={nameId}
              className="flex-1 rounded-md border border-brandcolor-200 px-2 py-1.5 text-sm"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              autoFocus
            />
          ) : (
            <p className="flex-1 text-sm font-medium">{label}</p>
          )}
          <button
            type="button"
            className="rounded p-1 text-brandcolor-500"
            aria-label="Rename"
            onClick={() => setEditingName((value) => !value)}
          >
            <RiPencilLine className="size-4" />
          </button>
        </div>
        <div
          className="mt-3 overflow-hidden rounded-md border border-brandcolor-200 bg-brandcolor-50 p-3"
          dangerouslySetInnerHTML={{ __html: sanitizeCanvasHtml(previewHtml) }}
        />
        <label className="mt-3 block text-canvas-ui text-brandcolor-700" htmlFor={descId}>
          Description
          <textarea
            id={descId}
            className="mt-1 h-20 w-full rounded-md border border-brandcolor-200 px-2 py-1.5 text-sm"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <label className="mt-3 flex items-center gap-2 text-canvas-ui text-brandcolor-700">
          <input
            type="checkbox"
            checked={sealed}
            onChange={(event) => setSealed(event.target.checked)}
          />
          Sealed (immutable in catalog)
        </label>
        {error ? (
          <p className="mt-2 rounded bg-brandcolor-warning-soft px-2 py-1 text-canvas-ui text-brandcolor-warning">
            {error}
          </p>
        ) : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-sm text-brandcolor-700 disabled:opacity-40"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md bg-brandcolor-700 px-3 py-1.5 text-sm text-white disabled:opacity-40"
            disabled={busy}
            onClick={() => onPublish({ label: label.trim() || defaultName, description, sealed })}
          >
            {busy ? 'Publishing…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

type CodeModalProps = {
  open: boolean
  sourceHtml: string
  blueprint: unknown
  onClose: () => void
}

export function CanvasCodeModal({ open, sourceHtml, blueprint, onClose }: CodeModalProps) {
  if (!open) {
    return null
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brandcolor-900/40 p-4">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-xl border border-brandcolor-200 bg-white p-4 shadow-lg">
        <h2 className="text-sm font-semibold">Component source</h2>
        <p className="mt-2 text-canvas-xs uppercase text-brandcolor-500">sourceHtml</p>
        <pre className="mt-1 max-h-48 overflow-auto rounded-md bg-brandcolor-50 p-2 text-xs">
          {sourceHtml}
        </pre>
        <p className="mt-3 text-canvas-xs uppercase text-brandcolor-500">blueprint</p>
        <pre className="mt-1 min-h-0 flex-1 overflow-auto rounded-md bg-brandcolor-50 p-2 text-xs">
          {JSON.stringify(blueprint, null, 2)}
        </pre>
        <button
          type="button"
          className="mt-3 self-end rounded-md bg-brandcolor-700 px-3 py-1.5 text-sm text-white"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}
