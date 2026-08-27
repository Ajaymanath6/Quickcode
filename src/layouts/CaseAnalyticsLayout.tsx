import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseAnalyticsLayoutProps = {
  caseRow: CaseRow
}

export default function CaseAnalyticsLayout({ caseRow }: CaseAnalyticsLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Analytics"
      icon="analytics"
      caseName={caseRow.name}
    />
  )
}
