import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SidebarBrandHeader from '@/components/shell/SidebarBrandHeader'
import SidebarDesignSystemNavLink from '@/components/shell/SidebarDesignSystemNavLink'
import ViewModeToggle from '@/components/shell/ViewModeToggle'
import { useLayoutWorkspace } from '@/context/LayoutWorkspaceContext'
import { catalogDisplayName, isLayoutEntry } from '@/lib/catalog-entry'
import type { CatalogEntry } from '@/lib/canvas-types'
import { fetchCatalogIndex } from '@/services/publish-workflow'

export default function CanvasSidebar() {
  const [params, setParams] = useSearchParams()
  const layoutMode = params.get('view') === 'layout'
  const workspace = useLayoutWorkspace()
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [draft, setDraft] = useState('')
  const [mentionOpen, setMentionOpen] = useState(false)
  const [mentionedIds, setMentionedIds] = useState<string[]>([])

  useEffect(() => {
    void fetchCatalogIndex().then(setCatalog)
  }, [])

  const published = useMemo(
    () => catalog.filter((entry) => !isLayoutEntry(entry)),
    [catalog],
  )

  const mentionChoices = useMemo(() => {
    if (!mentionOpen) {
      return []
    }
    const query = draft.split('@').at(-1)?.toLowerCase() ?? ''
    return published.filter((entry) => catalogDisplayName(entry).toLowerCase().includes(query))
  }, [draft, mentionOpen, published])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <SidebarBrandHeader />
      <SidebarDesignSystemNavLink />
      <div className="px-3 pb-2">
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-brandcolor-200 bg-brandcolor-50 p-0.5">
          <button
            type="button"
            className={`rounded-md px-2 py-1.5 text-[13px] ${
              !layoutMode
                ? 'border border-brandcolor-200 bg-white font-medium'
                : 'border border-transparent text-brandcolor-500'
            }`}
            onClick={() => {
              params.delete('view')
              setParams(params, { replace: true })
            }}
          >
            Components
          </button>
          <button
            type="button"
            className={`rounded-md px-2 py-1.5 text-[13px] ${
              layoutMode
                ? 'border border-brandcolor-200 bg-white font-medium'
                : 'border border-transparent text-brandcolor-500'
            }`}
            onClick={() => setParams({ view: 'layout' }, { replace: true })}
          >
            Layout
          </button>
        </div>
      </div>
      {layoutMode ? (
        <div className="min-h-0 flex-1 overflow-auto px-3 py-2">
          <p className="mb-2 text-[11px] uppercase tracking-wide text-brandcolor-500">
            Recent layouts
          </p>
          {workspace.entries.length === 0 ? (
            <p className="text-[13px] text-brandcolor-500">No layout prompts yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {workspace.entries.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-md border border-brandcolor-200 bg-white px-2 py-1.5 text-[13px]"
                >
                  {entry.prompt}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="min-h-0 flex-1" />
      )}
      {layoutMode ? (
        <form
          className="border-t border-brandcolor-200 p-3"
          onSubmit={(event) => {
            event.preventDefault()
            const prompt = draft.trim()
            if (!prompt) {
              return
            }
            workspace.addEntry(prompt, mentionedIds)
            setDraft('')
            setMentionedIds([])
            setMentionOpen(false)
          }}
        >
          <p className="mb-1 text-[11px] uppercase tracking-wide text-brandcolor-500">Ask…</p>
          {mentionedIds.length > 0 ? (
            <div className="mb-1 flex flex-wrap gap-1">
              {mentionedIds.map((id) => {
                const entry = published.find((item) => item.componentId === id)
                return (
                  <span key={id} className="rounded bg-white px-1.5 text-[11px]">
                    @{entry ? catalogDisplayName(entry) : 'component'}
                  </span>
                )
              })}
            </div>
          ) : null}
          <div className="relative">
            <textarea
              rows={2}
              className="w-full rounded-md border border-brandcolor-200 bg-white px-2 py-1.5 text-[13px]"
              placeholder="Describe a layout… use @ to mention published components"
              value={draft}
              onChange={(event) => {
                const value = event.target.value
                setDraft(value)
                setMentionOpen(value.includes('@'))
              }}
            />
            {mentionOpen && mentionChoices.length > 0 ? (
              <ul className="absolute bottom-full mb-1 max-h-32 w-full overflow-auto rounded-md border border-brandcolor-200 bg-white text-[13px] shadow">
                {mentionChoices.map((entry) => (
                  <li key={entry.componentId}>
                    <button
                      type="button"
                      className="w-full px-2 py-1 text-left hover:bg-brandcolor-50"
                      onClick={() => {
                        setMentionedIds((current) =>
                          current.includes(entry.componentId)
                            ? current
                            : [...current, entry.componentId],
                        )
                        setDraft(draft.replace(/@[^@]*$/, ''))
                        setMentionOpen(false)
                      }}
                    >
                      {catalogDisplayName(entry)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-brandcolor-700 px-2 py-1.5 text-[13px] text-white"
          >
            Generate layout
          </button>
        </form>
      ) : (
        <ViewModeToggle variant="footer" />
      )}
    </div>
  )
}
