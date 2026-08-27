import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseAddOnServicesLayoutProps = {
  caseRow: CaseRow
}

export default function CaseAddOnServicesLayout({ caseRow }: CaseAddOnServicesLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Add-on services"
      icon="extension"
      caseName={caseRow.name}
    />
  )
}
