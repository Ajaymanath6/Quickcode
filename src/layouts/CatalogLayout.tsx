import { Outlet, useLocation } from 'react-router-dom'
import CanvasSidebar from '@/components/shell/CanvasSidebar'
import CatalogMainHeader from '@/components/shell/CatalogMainHeader'
import CatalogSidebar from '@/components/shell/CatalogSidebar'
import CollapsibleSidebarShell from '@/components/shell/CollapsibleSidebarShell'
import { CatalogSidebarCollapseProvider } from '@/context/CatalogSidebarCollapseContext'
import { LayoutWorkspaceProvider } from '@/context/LayoutWorkspaceContext'
import { ThemeEngineProvider } from '@/context/ThemeEngineContext'

export default function CatalogLayout() {
  const location = useLocation()
  const onCanvas = location.pathname.startsWith('/admin/canvas')

  return (
    <ThemeEngineProvider>
      <CatalogSidebarCollapseProvider>
        <LayoutWorkspaceProvider>
          <div className="flex h-dvh overflow-hidden bg-brandcolor-50 text-brandcolor-900">
            <CollapsibleSidebarShell>
              {onCanvas ? <CanvasSidebar /> : <CatalogSidebar />}
            </CollapsibleSidebarShell>
            <div className="flex min-w-0 min-h-0 flex-1 flex-col">
              <CatalogMainHeader />
              <div
                className={`min-h-0 flex-1 ${onCanvas ? 'overflow-hidden' : 'overflow-auto'}`}
              >
                <Outlet />
              </div>
            </div>
          </div>
        </LayoutWorkspaceProvider>
      </CatalogSidebarCollapseProvider>
    </ThemeEngineProvider>
  )
}
