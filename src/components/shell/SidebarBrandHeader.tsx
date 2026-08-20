import { RiCodeSSlashLine } from '@remixicon/react'
import { Link } from 'react-router-dom'
import SidebarDuotoneIcon from '@/components/shell/SidebarDuotoneIcon'

export default function SidebarBrandHeader() {
  return (
    <Link to="/catalog/home" className="flex items-center gap-2 px-3 py-3 text-brandcolor-900">
      <SidebarDuotoneIcon icon={RiCodeSSlashLine} className="size-5 text-brandcolor-700" />
      <span className="text-[13px] font-semibold tracking-tight">QuickCode</span>
    </Link>
  )
}
