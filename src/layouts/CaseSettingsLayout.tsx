import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseSettingsLayoutProps = {
  caseRow: CaseRow
}

export default function CaseSettingsLayout({ caseRow }: CaseSettingsLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Settings"
      icon="settings"
      caseName={caseRow.name}
    />
  )
}
