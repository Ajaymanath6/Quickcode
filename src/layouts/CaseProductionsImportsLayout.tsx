import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseProductionsImportsLayoutProps = {
  caseRow: CaseRow
}

export default function CaseProductionsImportsLayout({ caseRow }: CaseProductionsImportsLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Productions & imports"
      icon="inventory_2"
      caseName={caseRow.name}
    />
  )
}
