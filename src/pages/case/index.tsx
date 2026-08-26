import AppHeader from '@/components/AppHeader'
import CaseListLayout from '@/layouts/CaseListLayout'

export default function CasePage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-brandcolor-fill font-lato text-brandcolor-textstrong">
      <AppHeader />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <CaseListLayout />
      </div>
    </div>
  )
}
