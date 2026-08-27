import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseAdvancedSearchLayoutProps = {
  caseRow: CaseRow
}

export default function CaseAdvancedSearchLayout({ caseRow }: CaseAdvancedSearchLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Advanced search"
      icon="manage_search"
      caseName={caseRow.name}
    />
  )
}
