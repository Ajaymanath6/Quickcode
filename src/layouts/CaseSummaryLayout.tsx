import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseSummaryLayoutProps = {
  caseRow: CaseRow
}

export default function CaseSummaryLayout({ caseRow }: CaseSummaryLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Summary"
      icon="summarize"
      caseName={caseRow.name}
    />
  )
}
