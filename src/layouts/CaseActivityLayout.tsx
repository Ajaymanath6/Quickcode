import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseActivityLayoutProps = {
  caseRow: CaseRow
}

export default function CaseActivityLayout({ caseRow }: CaseActivityLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Activity"
      icon="timeline"
      caseName={caseRow.name}
    />
  )
}
