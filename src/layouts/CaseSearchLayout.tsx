import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseSearchLayoutProps = {
  caseRow: CaseRow
}

export default function CaseSearchLayout({ caseRow }: CaseSearchLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Search"
      icon="search"
      caseName={caseRow.name}
    />
  )
}
