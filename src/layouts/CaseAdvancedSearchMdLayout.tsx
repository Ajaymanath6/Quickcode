import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseAdvancedSearchMdLayoutProps = {
  caseRow: CaseRow
}

export default function CaseAdvancedSearchMdLayout({ caseRow }: CaseAdvancedSearchMdLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Advanced search MD"
      icon="find_in_page"
      caseName={caseRow.name}
    />
  )
}
