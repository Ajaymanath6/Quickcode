import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseReviewSetsLayoutProps = {
  caseRow: CaseRow
}

export default function CaseReviewSetsLayout({ caseRow }: CaseReviewSetsLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Review sets"
      icon="rate_review"
      caseName={caseRow.name}
    />
  )
}
