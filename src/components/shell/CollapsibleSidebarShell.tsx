import type { ReactNode } from 'react'
import { useCatalogSidebarCollapse } from '@/context/CatalogSidebarCollapseContext'
import { sidebarChromeClass } from '@/components/shell/nav-classes'

export default function CollapsibleSidebarShell({ children }: { children: ReactNode }) {
  const { collapsed } = useCatalogSidebarCollapse()
  if (collapsed) {
    return null
  }
  return <aside className={sidebarChromeClass}>{children}</aside>
}
