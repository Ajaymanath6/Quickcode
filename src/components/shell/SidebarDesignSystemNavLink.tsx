import { RiPaletteLine } from '@remixicon/react'
import { NavLink } from 'react-router-dom'
import SidebarDuotoneIcon from '@/components/shell/SidebarDuotoneIcon'
import { navRowClass } from '@/components/shell/nav-classes'

export default function SidebarDesignSystemNavLink() {
  return (
    <div className="px-2 pb-2">
      <NavLink to="/catalog/home" className={({ isActive }) => navRowClass(isActive)}>
        <SidebarDuotoneIcon icon={RiPaletteLine} />
        Design system
      </NavLink>
    </div>
  )
}
