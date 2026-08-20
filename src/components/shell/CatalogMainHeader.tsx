import { RiMenuUnfoldLine } from '@remixicon/react'
import { useLocation } from 'react-router-dom'
import { useCatalogSidebarCollapse } from '@/context/CatalogSidebarCollapseContext'

function titleForPath(pathname: string, search: string): string {
  if (pathname.startsWith('/admin/canvas')) {
    return new URLSearchParams(search).get('view') === 'layout' ? 'Layout workspace' : 'Components canvas'
  }
  if (pathname === '/catalog/home') {
    return 'Library'
  }
  if (pathname === '/catalog/all') {
    return 'All components'
  }
  if (pathname === '/catalog/layouts') {
    return 'Layouts'
  }
  if (pathname === '/catalog/bookmarks') {
    return 'Bookmarks'
  }
  if (pathname.endsWith('/colors')) {
    return 'Colors'
  }
  if (pathname.endsWith('/typography')) {
    return 'Typography'
  }
  if (pathname.endsWith('/shadows')) {
    return 'Shadows'
  }
  if (pathname.endsWith('/spacing')) {
    return 'Spacing'
  }
  if (pathname.startsWith('/catalog/theme')) {
    return 'Theme configuration'
  }
  return 'Catalog'
}

export default function CatalogMainHeader() {
  const { collapsed, setCollapsed } = useCatalogSidebarCollapse()
  const location = useLocation()
  const title = titleForPath(location.pathname, location.search)

  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-brandcolor-200 bg-white px-4 py-2.5">
      {collapsed ? (
        <button
          type="button"
          className="rounded-md border border-brandcolor-200 p-1 text-brandcolor-700"
          aria-label="Expand sidebar"
          onClick={() => setCollapsed(false)}
        >
          <RiMenuUnfoldLine className="size-4" />
        </button>
      ) : (
        <button
          type="button"
          className="rounded-md p-1 text-brandcolor-500 hover:bg-brandcolor-50"
          aria-label="Collapse sidebar"
          onClick={() => setCollapsed(true)}
        >
          <RiMenuUnfoldLine className="size-4 rotate-180" />
        </button>
      )}
      <h1 className="text-sm font-semibold text-brandcolor-900">{title}</h1>
    </header>
  )
}
