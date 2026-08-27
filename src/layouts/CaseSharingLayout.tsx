import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseSharingLayoutProps = {
  caseRow: CaseRow
}

export default function CaseSharingLayout({ caseRow }: CaseSharingLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Sharing"
      icon="group"
      caseName={caseRow.name}
    />
  )
}
