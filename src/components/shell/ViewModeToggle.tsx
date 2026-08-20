import { RiBook2Line, RiLayoutGridLine } from '@remixicon/react'
import { useLocation, useNavigate } from 'react-router-dom'
import SidebarDuotoneIcon from '@/components/shell/SidebarDuotoneIcon'

type ViewModeToggleProps = {
  variant?: 'default' | 'footer'
}

export default function ViewModeToggle({ variant = 'default' }: ViewModeToggleProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const canvasActive = location.pathname.startsWith('/admin/canvas')

  return (
    <div className={variant === 'footer' ? 'border-t border-brandcolor-200 p-3' : 'p-3'}>
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-brandcolor-500">
        View
      </p>
      <div className="grid grid-cols-2 gap-1 rounded-lg border border-brandcolor-200 bg-brandcolor-50 p-0.5">
        <button
          type="button"
          className={`flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[13px] ${
            !canvasActive
              ? 'border border-brandcolor-200 bg-white text-brandcolor-900'
              : 'border border-transparent text-brandcolor-500'
          }`}
          onClick={() => navigate('/catalog/home')}
        >
          <SidebarDuotoneIcon icon={RiBook2Line} />
          Catalog
        </button>
        <button
          type="button"
          className={`flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[13px] ${
            canvasActive
              ? 'border border-brandcolor-200 bg-white text-brandcolor-900'
              : 'border border-transparent text-brandcolor-500'
          }`}
          onClick={() => navigate('/admin/canvas')}
        >
          <SidebarDuotoneIcon icon={RiLayoutGridLine} />
          Canvas
        </button>
      </div>
    </div>
  )
}
