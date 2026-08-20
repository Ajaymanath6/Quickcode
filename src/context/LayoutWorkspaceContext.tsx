import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

const STORAGE_KEY = 'quickcode.layout.prompts'

export type LayoutPromptEntry = {
  id: string
  prompt: string
  mentionedIds: string[]
  createdAt: string
}

type LayoutWorkspaceValue = {
  entries: LayoutPromptEntry[]
  addEntry: (prompt: string, mentionedIds: string[]) => void
}

const LayoutWorkspaceContext = createContext<LayoutWorkspaceValue | null>(null)

function readEntries(): LayoutPromptEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as LayoutPromptEntry[]) : []
  } catch {
    return []
  }
}

export function LayoutWorkspaceProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LayoutPromptEntry[]>(readEntries)

  const addEntry = useCallback((prompt: string, mentionedIds: string[]) => {
    const next: LayoutPromptEntry = {
      id: crypto.randomUUID(),
      prompt,
      mentionedIds,
      createdAt: new Date().toISOString(),
    }
    setEntries((current) => {
      const list = [next, ...current].slice(0, 40)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
      return list
    })
  }, [])

  const value = useMemo(() => ({ entries, addEntry }), [addEntry, entries])

  return (
    <LayoutWorkspaceContext.Provider value={value}>{children}</LayoutWorkspaceContext.Provider>
  )
}

export function useLayoutWorkspace(): LayoutWorkspaceValue {
  const value = useContext(LayoutWorkspaceContext)
  if (!value) {
    throw new Error('useLayoutWorkspace must be used within LayoutWorkspaceProvider')
  }
  return value
}
