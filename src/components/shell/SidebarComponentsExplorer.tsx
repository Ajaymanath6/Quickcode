import { useEffect, useState } from 'react'
import { RiApps2Line, RiLayout4Line } from '@remixicon/react'
import { NavLink } from 'react-router-dom'
import SidebarDuotoneIcon from '@/components/shell/SidebarDuotoneIcon'
import { navRowClass } from '@/components/shell/nav-classes'
import { fetchCatalogIndex } from '@/services/publish-workflow'
import { isLayoutEntry } from '@/lib/catalog-entry'

export default function SidebarComponentsExplorer({ query }: { query: string }) {
  const [open, setOpen] = useState(true)
  const [componentCount, setComponentCount] = useState(0)
  const [layoutCount, setLayoutCount] = useState(0)

  useEffect(() => {
    void fetchCatalogIndex().then((entries) => {
      setComponentCount(entries.filter((entry) => !isLayoutEntry(entry)).length)
      setLayoutCount(entries.filter((entry) => isLayoutEntry(entry)).length)
    })
  }, [])

  const needle = query.trim().toLowerCase()
  const showAll = !needle || 'all components'.includes(needle)
  const showLayouts = !needle || 'layouts'.includes(needle)

  return (
    <div className="px-2 pb-2">
      <button
        type="button"
        className="w-full px-2 py-1.5 text-left text-[11px] font-medium uppercase tracking-wide text-brandcolor-500"
        onClick={() => setOpen((value) => !value)}
      >
        Components
      </button>
      {open ? (
        <div className="space-y-0.5">
          {showAll ? (
            <NavLink to="/catalog/all" className={({ isActive }) => navRowClass(isActive)}>
              <SidebarDuotoneIcon icon={RiApps2Line} />
              All
              <span className="ml-auto text-[11px] text-brandcolor-500">{String(componentCount)}</span>
            </NavLink>
          ) : null}
          {showLayouts ? (
            <NavLink to="/catalog/layouts" className={({ isActive }) => navRowClass(isActive)}>
              <SidebarDuotoneIcon icon={RiLayout4Line} />
              Layouts
              <span className="ml-auto text-[11px] text-brandcolor-500">{String(layoutCount)}</span>
            </NavLink>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
