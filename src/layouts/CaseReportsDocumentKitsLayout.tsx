import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseReportsDocumentKitsLayoutProps = {
  caseRow: CaseRow
}

export default function CaseReportsDocumentKitsLayout({ caseRow }: CaseReportsDocumentKitsLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Reports & document kits"
      icon="description"
      caseName={caseRow.name}
    />
  )
}
