import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseAuditLogLayoutProps = {
  caseRow: CaseRow
}

export default function CaseAuditLogLayout({ caseRow }: CaseAuditLogLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Audit log"
      icon="history"
      caseName={caseRow.name}
    />
  )
}
