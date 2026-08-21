import { NavLink, useLocation } from 'react-router-dom'
import { navRowClass } from '@/components/shell/nav-classes'

const THEME_LINKS = [
  { to: '/catalog/theme/colors', label: 'Colors' },
  { to: '/catalog/theme/typography', label: 'Typography' },
  { to: '/catalog/theme/shadows', label: 'Shadows' },
  { to: '/catalog/theme/spacing', label: 'Spacing' },
]

export default function ThemeConfigurationNavSection() {
  const location = useLocation()
  const parentActive = location.pathname.startsWith('/catalog/theme')

  return (
    <div className="px-2 pb-2">
      <NavLink to="/catalog/theme/colors" className={() => navRowClass(parentActive)}>
        Theme configuration
      </NavLink>
      <div className="ml-3 mt-1 border-l border-brandcolor-strokeweak pl-2">
        {THEME_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${navRowClass(isActive)} py-1`}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
