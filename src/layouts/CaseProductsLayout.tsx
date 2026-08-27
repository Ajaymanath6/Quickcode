import type { CaseRow } from '@/data/cases'
import CaseSectionPlaceholder from '@/layouts/CaseSectionPlaceholder'

type CaseProductsLayoutProps = {
  caseRow: CaseRow
}

export default function CaseProductsLayout({ caseRow }: CaseProductsLayoutProps) {
  return (
    <CaseSectionPlaceholder
      title="Products"
      icon="category"
      caseName={caseRow.name}
    />
  )
}
