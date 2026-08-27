import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseDeDupeLayoutProps = {
  caseRow: CaseRow
}

export default function CaseDeDupeLayout({ caseRow }: CaseDeDupeLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="De-dupe"
      icon="content_copy"
      caseName={caseRow.name}
    />
  )
}
