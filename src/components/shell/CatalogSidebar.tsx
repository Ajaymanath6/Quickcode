import { useState } from 'react'
import { RiHome5Line } from '@remixicon/react'
import { NavLink } from 'react-router-dom'
import SearchBar from '@/components/shell/SearchBar'
import SidebarBrandHeader from '@/components/shell/SidebarBrandHeader'
import SidebarComponentsExplorer from '@/components/shell/SidebarComponentsExplorer'
import SidebarDuotoneIcon from '@/components/shell/SidebarDuotoneIcon'
import ThemeConfigurationNavSection from '@/components/shell/ThemeConfigurationNavSection'
import ViewModeToggle from '@/components/shell/ViewModeToggle'
import { navRowClass } from '@/components/shell/nav-classes'

export default function CatalogSidebar() {
  const [query, setQuery] = useState('')

  return (
    <div className="flex h-full min-h-0 flex-col">
      <SidebarBrandHeader />
      <SearchBar value={query} onChange={setQuery} />
      <nav className="min-h-0 flex-1 overflow-auto px-0">
        <div className="px-2 pb-2">
          <NavLink to="/catalog/home" className={({ isActive }) => navRowClass(isActive)}>
            <SidebarDuotoneIcon icon={RiHome5Line} />
            Home
          </NavLink>
        </div>
        <ThemeConfigurationNavSection />
        <SidebarComponentsExplorer query={query} />
      </nav>
      <ViewModeToggle variant="default" />
    </div>
  )
}
