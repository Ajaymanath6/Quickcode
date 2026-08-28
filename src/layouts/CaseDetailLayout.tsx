import { Link, Navigate, useParams } from 'react-router-dom'
import type { CaseRow } from '@/data/cases'
import {
  DEFAULT_CASE_SECTION,
  DEFAULT_WORKSPACE_SECTION,
  getCaseSection,
  getCaseTopTabs,
  isCaseSectionId,
  isWorkspaceSection,
} from '@/data/caseSections'
import GoogleDuotoneIcon from '@/components/GoogleDuotoneIcon'
import CaseWorkspaceLayout from '@/layouts/CaseWorkspaceLayout'
import { getCaseSectionLayout } from '@/layouts/caseSectionLayouts'

const ACTION_BUTTONS = ['Refresh', 'Export'] as const

type CaseDetailLayoutProps = {
  caseRow: CaseRow
}

export default function CaseDetailLayout({ caseRow }: CaseDetailLayoutProps) {
  const { section } = useParams()

  if (!isCaseSectionId(section)) {
    return <Navigate to={`/case-detail/${caseRow.id}/${DEFAULT_CASE_SECTION}`} replace />
  }

  const activeSection = getCaseSection(section)!
  const topTabs = getCaseTopTabs()
  const workspaceMode = isWorkspaceSection(activeSection)
  const SectionLayout = getCaseSectionLayout(activeSection.id)

  return (
    <div className="font-lato">
      <div className="border-b border-brandcolor-strokeweak bg-brandcolor-white">
        <div className="mx-auto w-full max-w-7xl px-6 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <Link
              to="/case"
              className="inline-flex items-center gap-1 rounded-md border border-brandcolor-strokeweak bg-brandcolor-white px-4 py-2 text-sm font-medium text-brandcolor-textweak transition-colors hover:bg-brandcolor-fill hover:text-brandcolor-secondary"
            >
              <GoogleDuotoneIcon
                name="arrow_back"
                className="text-[16px] !text-current"
              />
              Home
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              {ACTION_BUTTONS.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-md border border-brandcolor-strokeweak bg-brandcolor-white px-4 py-2 text-sm font-medium text-brandcolor-secondary transition-colors hover:bg-brandcolor-fill"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 min-w-0">
            <h1 className="font-catamaran text-xl font-semibold text-brandcolor-textstrong sm:text-2xl">
              {caseRow.name}
            </h1>
            <p className="mt-1 text-sm text-brandcolor-textweak">
              Last refreshed on 3 Jun 2024. Last refresh with an update 8 Jun 2025.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-6">
          <nav
            className="flex flex-wrap gap-1 border-t border-brandcolor-strokeweak pt-1"
            aria-label="Case sections"
          >
            {topTabs.map((tab) => {
              const isActive =
                tab.kind === 'workspace'
                  ? workspaceMode
                  : !workspaceMode && tab.id === activeSection.id
              const to =
                tab.kind === 'workspace'
                  ? `/case-detail/${caseRow.id}/${DEFAULT_WORKSPACE_SECTION}`
                  : `/case-detail/${caseRow.id}/${tab.id}`

              return (
                <Link
                  key={tab.id}
                  to={to}
                  className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-brandcolor-secondary text-brandcolor-secondary'
                      : 'border-transparent text-brandcolor-textweak hover:text-brandcolor-textstrong'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {workspaceMode ? (
        <CaseWorkspaceLayout caseRow={caseRow} activeSectionId={activeSection.id}>
          <SectionLayout caseRow={caseRow} />
        </CaseWorkspaceLayout>
      ) : (
        <div className="mx-auto w-full max-w-7xl px-6 py-6">
          <SectionLayout caseRow={caseRow} />
        </div>
      )}
    </div>
  )
}
