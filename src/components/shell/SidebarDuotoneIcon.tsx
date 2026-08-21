import { RiHomeLine } from '@remixicon/react'

type SidebarDuotoneIconProps = {
  icon: typeof RiHomeLine
  className?: string
}

export default function SidebarDuotoneIcon({ icon: Icon, className }: SidebarDuotoneIconProps) {
  return <Icon className={className ?? 'size-4 text-brandcolor-textweak'} aria-hidden />
}
