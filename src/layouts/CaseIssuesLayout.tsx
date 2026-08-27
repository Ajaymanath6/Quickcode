import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseIssuesLayoutProps = {
  caseRow: CaseRow
}

export default function CaseIssuesLayout({ caseRow }: CaseIssuesLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Issues"
      icon="flag"
      caseName={caseRow.name}
    />
  )
}
