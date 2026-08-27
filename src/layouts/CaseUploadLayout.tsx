import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseUploadLayoutProps = {
  caseRow: CaseRow
}

export default function CaseUploadLayout({ caseRow }: CaseUploadLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Upload"
      icon="upload_file"
      caseName={caseRow.name}
    />
  )
}
