import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseTagsLayoutProps = {
  caseRow: CaseRow
}

export default function CaseTagsLayout({ caseRow }: CaseTagsLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Tags"
      icon="sell"
      caseName={caseRow.name}
    />
  )
}
