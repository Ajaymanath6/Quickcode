import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseFilesLayoutProps = {
  caseRow: CaseRow
}

export default function CaseFilesLayout({ caseRow }: CaseFilesLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Files"
      icon="folder"
      caseName={caseRow.name}
    />
  )
}
