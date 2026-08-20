import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CanvasTool } from '@/lib/canvas-types'

type CanvasChromeValue = {
  tool: CanvasTool
  setTool: (tool: CanvasTool) => void
  spaceHeld: boolean
  setSpaceHeld: (held: boolean) => void
  hideBlockChrome: boolean
  setHideBlockChrome: (hidden: boolean) => void
  promptFocusNonce: number
  requestPromptFocus: () => void
}

const CanvasChromeContext = createContext<CanvasChromeValue | null>(null)

export function CanvasChromeProvider({ children }: { children: ReactNode }) {
  const [tool, setTool] = useState<CanvasTool>('select')
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [hideBlockChrome, setHideBlockChrome] = useState(false)
  const [promptFocusNonce, setPromptFocusNonce] = useState(0)

  const requestPromptFocus = useCallback(() => {
    setPromptFocusNonce((value) => value + 1)
  }, [])

  const value = useMemo(
    () => ({
      tool,
      setTool,
      spaceHeld,
      setSpaceHeld,
      hideBlockChrome,
      setHideBlockChrome,
      promptFocusNonce,
      requestPromptFocus,
    }),
    [tool, spaceHeld, hideBlockChrome, promptFocusNonce, requestPromptFocus],
  )

  return (
    <CanvasChromeContext.Provider value={value}>{children}</CanvasChromeContext.Provider>
  )
}

export function useCanvasChrome(): CanvasChromeValue {
  const value = useContext(CanvasChromeContext)
  if (!value) {
    throw new Error('useCanvasChrome must be used within CanvasChromeProvider')
  }
  return value
}
