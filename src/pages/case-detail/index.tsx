import { Link, useParams } from 'react-router-dom'
import AppHeader from '@/components/AppHeader'
import { getCaseById } from '@/data/cases'
import {
  DEFAULT_CASE_SECTION,
  getCaseSection,
  isCaseSectionId,
} from '@/data/caseSections'
import CaseDetailLayout from '@/layouts/CaseDetailLayout'

export default function CaseDetailPage() {
  const { caseId, section } = useParams()
  const caseRow = caseId ? getCaseById(caseId) : undefined
  const activeSection = isCaseSectionId(section)
    ? getCaseSection(section)
    : getCaseSection(DEFAULT_CASE_SECTION)

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-brandcolor-fill font-lato text-brandcolor-textstrong">
      <AppHeader
        breadcrumbs={
          caseRow && activeSection
            ? {
                caseId: caseRow.id,
                caseName: caseRow.name,
                sectionLabel: activeSection.label,
              }
            : undefined
        }
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {caseRow ? (
          <CaseDetailLayout caseRow={caseRow} />
        ) : (
          <div className="mx-auto max-w-lg px-6 py-16 text-center">
            <h1 className="font-catamaran text-2xl font-semibold">Case not found</h1>
            <p className="mt-2 text-sm text-brandcolor-textweak">
              The case you are looking for does not exist or may have been removed.
            </p>
            <Link
              to="/case"
              className="mt-6 inline-flex rounded-md bg-brandcolor-secondary px-4 py-2 text-sm font-semibold text-brandcolor-white hover:bg-brandcolor-secondaryhover"
            >
              Back to cases
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
