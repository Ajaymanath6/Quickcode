import { useEffect, useMemo, useRef, useState } from 'react'
import { RiSendPlane2Line } from '@remixicon/react'
import { useCanvasChrome } from '@/context/CanvasChromeContext'
import { useComponentsCanvasAi } from '@/context/ComponentsCanvasAiContext'
import type { CanvasNode } from '@/lib/canvas-types'

function nodeTitle(node: CanvasNode): string {
  if ('label' in node && node.label) {
    return node.label
  }
  if ('title' in node) {
    return node.title
  }
  return node.kind
}

export default function ComponentsCanvasPromptPanel({ nodes }: { nodes: CanvasNode[] }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { promptFocusNonce } = useCanvasChrome()
  const ai = useComponentsCanvasAi()
  const [mentionOpen, setMentionOpen] = useState(false)

  useEffect(() => {
    if (promptFocusNonce > 0) {
      textareaRef.current?.focus()
    }
  }, [promptFocusNonce])

  const mentionChoices = useMemo(() => {
    const query = ai.draft.split('@').at(-1)?.toLowerCase() ?? ''
    if (!ai.draft.includes('@')) {
      return []
    }
    return nodes.filter((node) => nodeTitle(node).toLowerCase().includes(query))
  }, [ai.draft, nodes])

  const htmlMentioned = nodes.some(
    (node) => node.kind === 'htmlSnippet' && ai.mentionedIds.includes(node.id),
  )

  return (
    <div className="pointer-events-auto w-[min(100%,560px)] rounded-xl border border-brandcolor-200 bg-white/95 p-2 shadow-lg backdrop-blur">
      <div className="flex gap-1 text-canvas-xs">
        <button
          type="button"
          className={`rounded px-2 py-0.5 ${ai.mode === 'plan' ? 'bg-brandcolor-100 font-medium' : 'text-brandcolor-500'}`}
          onClick={() => ai.setMode('plan')}
        >
          Plan
        </button>
        <button
          type="button"
          className={`rounded px-2 py-0.5 ${ai.mode === 'html' ? 'bg-brandcolor-100 font-medium' : 'text-brandcolor-500'}`}
          onClick={() => ai.setMode('html')}
        >
          HTML creator
        </button>
      </div>
      {ai.mentionedIds.length > 0 ? (
        <div className="mt-1 flex flex-wrap gap-1">
          {ai.mentionedIds.map((id) => {
            const node = nodes.find((item) => item.id === id)
            return (
              <button
                key={id}
                type="button"
                className="rounded bg-brandcolor-100 px-1.5 py-0.5 text-canvas-xs"
                onClick={() => ai.removeMention(id)}
              >
                @{node ? nodeTitle(node) : 'block'} ×
              </button>
            )
          })}
        </div>
      ) : null}
      <div className="relative mt-1">
        <textarea
          ref={textareaRef}
          rows={2}
          className="w-full resize-none rounded-md border border-brandcolor-200 px-2 py-1.5 pr-9 text-sm"
          placeholder={
            ai.mode === 'plan' ? 'Plan components to place…' : 'Describe HTML to generate…'
          }
          value={ai.draft}
          disabled={ai.busy}
          onChange={(event) => {
            const value = event.target.value
            ai.setDraft(value)
            setMentionOpen(value.includes('@'))
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              void ai.submit()
            }
          }}
        />
        <button
          type="button"
          className="absolute bottom-2 right-2 text-brandcolor-700 disabled:opacity-40"
          disabled={ai.busy}
          onClick={() => void ai.submit()}
          aria-label="Send"
        >
          <RiSendPlane2Line className="size-4" />
        </button>
        {mentionOpen && mentionChoices.length > 0 ? (
          <ul className="absolute bottom-full mb-1 max-h-36 w-full overflow-auto rounded-md border border-brandcolor-200 bg-white text-canvas-ui shadow">
            {mentionChoices.map((node) => (
              <li key={node.id}>
                <button
                  type="button"
                  className="w-full px-2 py-1 text-left hover:bg-brandcolor-50"
                  onClick={() => {
                    ai.addMention(node.id)
                    ai.setDraft(ai.draft.replace(/@[^@]*$/, ''))
                    setMentionOpen(false)
                  }}
                >
                  {nodeTitle(node)}
                  <span className="ml-1 text-brandcolor-500">{node.kind}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-canvas-xs text-brandcolor-700">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={ai.extendedDesignContext}
            onChange={(event) => ai.setExtendedDesignContext(event.target.checked)}
          />
          Extended design context
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={ai.spacingEnforcement}
            onChange={(event) => ai.setSpacingEnforcement(event.target.checked)}
          />
          Spacing enforcement
        </label>
        {htmlMentioned && ai.mode === 'html' ? (
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={ai.addAsNew}
              onChange={(event) => ai.setAddAsNew(event.target.checked)}
            />
            Add as new instead
          </label>
        ) : null}
        {ai.busy ? <span className="text-brandcolor-500">Generating…</span> : null}
      </div>
      {ai.error ? (
        <p className="mt-1 rounded bg-brandcolor-warning-soft px-2 py-1 text-canvas-ui text-brandcolor-warning">
          {ai.error}
        </p>
      ) : null}
    </div>
  )
}
