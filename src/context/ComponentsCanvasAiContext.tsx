import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { CanvasNode, Rect } from '@/lib/canvas-types'
import { mapCanvasPlanToNodes } from '@/lib/map-canvas-plan-to-nodes'
import { sanitizeCanvasHtml } from '@/lib/sanitize-canvas-html'
import { useThemeEngine } from '@/context/ThemeEngineContext'
import { themeSnapshotFromMaps } from '@/lib/theme/theme-storage'
import { postCanvasGenerateHtml } from '@/services/components-canvas-html'
import { postCanvasPlan } from '@/services/components-canvas-llm'

export type ChatTurn = { role: 'user' | 'assistant'; content: string }
export type AiMode = 'plan' | 'html'

export type CanvasBoardApi = {
  getNodes: () => CanvasNode[]
  appendNodes: (nodes: CanvasNode[]) => void
  replaceNode: (id: string, node: CanvasNode) => void
  focusBlocks: (ids: string[]) => void
  setSkeleton: (rect: Rect | null) => void
}

type ComponentsCanvasAiValue = {
  mode: AiMode
  setMode: (mode: AiMode) => void
  draft: string
  setDraft: (draft: string) => void
  mentionedIds: string[]
  addMention: (id: string) => void
  removeMention: (id: string) => void
  history: ChatTurn[]
  extendedDesignContext: boolean
  setExtendedDesignContext: (value: boolean) => void
  spacingEnforcement: boolean
  setSpacingEnforcement: (value: boolean) => void
  addAsNew: boolean
  setAddAsNew: (value: boolean) => void
  busy: boolean
  error: string | null
  submit: () => Promise<void>
  registerBoardApi: (api: CanvasBoardApi) => void
}

const ComponentsCanvasAiContext = createContext<ComponentsCanvasAiValue | null>(null)

export function ComponentsCanvasAiProvider({ children }: { children: ReactNode }) {
  const theme = useThemeEngine()
  const boardApiRef = useRef<CanvasBoardApi | null>(null)
  const [mode, setMode] = useState<AiMode>('plan')
  const [draft, setDraft] = useState('')
  const [mentionedIds, setMentionedIds] = useState<string[]>([])
  const [history, setHistory] = useState<ChatTurn[]>([])
  const [extendedDesignContext, setExtendedDesignContext] = useState(false)
  const [spacingEnforcement, setSpacingEnforcement] = useState(true)
  const [addAsNew, setAddAsNew] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const registerBoardApi = useCallback((api: CanvasBoardApi) => {
    boardApiRef.current = api
  }, [])

  const addMention = useCallback((id: string) => {
    setMentionedIds((current) => (current.includes(id) ? current : [...current, id]))
  }, [])

  const removeMention = useCallback((id: string) => {
    setMentionedIds((current) => current.filter((item) => item !== id))
  }, [])

  const submit = useCallback(async () => {
    const api = boardApiRef.current
    if (!api || busy) {
      return
    }
    const prompt = draft.trim()
    if (!prompt) {
      setError('Enter a prompt.')
      return
    }
    setBusy(true)
    setError(null)
    const nodes = api.getNodes()
    const mentioned = nodes.filter((node) => mentionedIds.includes(node.id))
    const anchor = mentioned[0] ?? nodes[nodes.length - 1]
    const skeleton = {
      x: (anchor?.x ?? 200) + 40,
      y: (anchor?.y ?? 200) + 40,
      width: 240,
      height: 120,
    }
    api.setSkeleton(skeleton)
    const payload = {
      prompt,
      mentionedIds,
      history,
      extendedDesignContext,
      spacingEnforcement,
      themeSnapshot: themeSnapshotFromMaps(theme.draft),
    }
    try {
      if (mode === 'plan') {
        const response = await postCanvasPlan(payload)
        const created = mapCanvasPlanToNodes(
          response.plan?.nodes ?? response.nodes ?? [],
          skeleton.x,
          skeleton.y,
        )
        api.appendNodes(created)
        api.focusBlocks(created.map((node) => node.id))
        setHistory((current) => [
          ...current,
          { role: 'user', content: prompt },
          { role: 'assistant', content: `Added ${String(created.length)} planned node(s).` },
        ])
      } else {
        const response = await postCanvasGenerateHtml(payload)
        const html = sanitizeCanvasHtml(response.html)
        const htmlMentions = mentioned.filter((node) => node.kind === 'htmlSnippet')
        const replaceTarget =
          !addAsNew && htmlMentions.length === 1 ? htmlMentions[0] : null
        if (replaceTarget && replaceTarget.kind === 'htmlSnippet') {
          const next = {
            ...replaceTarget,
            html,
            label: response.label ?? replaceTarget.label,
            userResized: false,
          }
          api.replaceNode(replaceTarget.id, next)
          api.focusBlocks([replaceTarget.id])
        } else {
          const created: CanvasNode = {
            id: crypto.randomUUID(),
            kind: 'htmlSnippet',
            x: skeleton.x,
            y: skeleton.y,
            label: response.label ?? 'HTML snippet',
            html,
            widthPx: 320,
            shellHeightPx: 200,
          }
          api.appendNodes([created])
          api.focusBlocks([created.id])
        }
        setHistory((current) => [
          ...current,
          { role: 'user', content: prompt },
          { role: 'assistant', content: 'Inserted HTML snippet.' },
        ])
      }
      setDraft('')
      setMentionedIds([])
    } catch {
      setError('Generation failed. The mock API could not complete.')
    } finally {
      api.setSkeleton(null)
      setBusy(false)
    }
  }, [
    addAsNew,
    busy,
    draft,
    extendedDesignContext,
    history,
    mentionedIds,
    mode,
    spacingEnforcement,
    theme.draft,
  ])

  const value = useMemo(
    () => ({
      mode,
      setMode,
      draft,
      setDraft,
      mentionedIds,
      addMention,
      removeMention,
      history,
      extendedDesignContext,
      setExtendedDesignContext,
      spacingEnforcement,
      setSpacingEnforcement,
      addAsNew,
      setAddAsNew,
      busy,
      error,
      submit,
      registerBoardApi,
    }),
    [
      addAsNew,
      addMention,
      busy,
      draft,
      error,
      extendedDesignContext,
      history,
      mentionedIds,
      mode,
      registerBoardApi,
      removeMention,
      spacingEnforcement,
      submit,
    ],
  )

  return (
    <ComponentsCanvasAiContext.Provider value={value}>
      {children}
    </ComponentsCanvasAiContext.Provider>
  )
}

export function useComponentsCanvasAi(): ComponentsCanvasAiValue {
  const value = useContext(ComponentsCanvasAiContext)
  if (!value) {
    throw new Error('useComponentsCanvasAi must be used within ComponentsCanvasAiProvider')
  }
  return value
}
