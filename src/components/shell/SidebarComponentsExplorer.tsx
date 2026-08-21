import { useState } from 'react'
import { RiApps2Line, RiBookmarkLine, RiLayout4Line } from '@remixicon/react'
import { NavLink } from 'react-router-dom'
import SidebarDuotoneIcon from '@/components/shell/SidebarDuotoneIcon'
import { navRowClass } from '@/components/shell/nav-classes'
import { isLayoutEntry } from '@/lib/catalog-entry'
import { useCatalogCards } from '@/context/CatalogContext'

export default function SidebarComponentsExplorer({ query }: { query: string }) {
  const [open, setOpen] = useState(true)
  const { cards, bookmarks } = useCatalogCards()
  const componentCount = cards.filter((card) => !isLayoutEntry(card.entry)).length
  const layoutCount = cards.filter((card) => isLayoutEntry(card.entry)).length

  const needle = query.trim().toLowerCase()
  const showAll = !needle || 'all components'.includes(needle)
  const showLayouts = !needle || 'layouts'.includes(needle)
  const showBookmarks = !needle || 'bookmarks'.includes(needle)

  return (
    <div className="px-2 pb-2">
      <button
        type="button"
        className="w-full px-2 py-1.5 text-left text-[11px] font-medium uppercase tracking-wide text-brandcolor-textweak"
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
              <span className="ml-auto text-[11px] text-brandcolor-textweak">{String(componentCount)}</span>
            </NavLink>
          ) : null}
          {showLayouts ? (
            <NavLink to="/catalog/layouts" className={({ isActive }) => navRowClass(isActive)}>
              <SidebarDuotoneIcon icon={RiLayout4Line} />
              Layouts
              <span className="ml-auto text-[11px] text-brandcolor-textweak">{String(layoutCount)}</span>
            </NavLink>
          ) : null}
          {showBookmarks ? (
            <NavLink to="/catalog/bookmarks" className={({ isActive }) => navRowClass(isActive)}>
              <SidebarDuotoneIcon icon={RiBookmarkLine} />
              Bookmarks
              <span className="ml-auto text-[11px] text-brandcolor-textweak">{String(bookmarks.size)}</span>
            </NavLink>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
