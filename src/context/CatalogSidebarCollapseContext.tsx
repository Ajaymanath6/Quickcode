import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

const STORAGE_KEY = 'quickcode.sidebar.collapsed'

type CollapseValue = {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  toggleCollapsed: () => void
}

const CatalogSidebarCollapseContext = createContext<CollapseValue | null>(null)

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function CatalogSidebarCollapseProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedState] = useState(readCollapsed)

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(next)
    localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
  }, [])

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed, setCollapsed])

  const value = useMemo(
    () => ({ collapsed, setCollapsed, toggleCollapsed }),
    [collapsed, setCollapsed, toggleCollapsed],
  )

  return (
    <CatalogSidebarCollapseContext.Provider value={value}>
      {children}
    </CatalogSidebarCollapseContext.Provider>
  )
}

export function useCatalogSidebarCollapse(): CollapseValue {
  const value = useContext(CatalogSidebarCollapseContext)
  if (!value) {
    throw new Error('useCatalogSidebarCollapse must be used within provider')
  }
  return value
}
