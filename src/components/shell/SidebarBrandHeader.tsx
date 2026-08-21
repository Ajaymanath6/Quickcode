import BrandLogo from '@/components/BrandLogo'

export default function SidebarBrandHeader() {
  return (
    <div className="flex items-center px-3 py-3">
      <BrandLogo imgClassName="h-7 w-auto max-w-[160px] object-contain object-left" />
    </div>
  )
}
