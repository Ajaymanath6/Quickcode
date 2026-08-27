import { Link, Navigate, useParams } from 'react-router-dom'
import type { CaseRow } from '@/data/cases'
import {
  CASE_SIDEBAR_GROUPS,
  DEFAULT_CASE_SECTION,
  DEFAULT_WORKSPACE_SECTION,
  getCaseSection,
  getCaseSectionsByGroup,
  getCaseTopTabs,
  isCaseSectionId,
  isWorkspaceSection,
} from '@/data/caseSections'
import GoogleDuotoneIcon from '@/components/GoogleDuotoneIcon'
import CaseStartHereLayout from '@/layouts/CaseStartHereLayout'

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

  return (
    <div className="font-lato">
      <div className="border-b border-brandcolor-strokeweak bg-brandcolor-white pt-[28px]">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-start justify-between gap-4 px-6 pb-6">
          <div className="min-w-0 flex-1">
            <Link
              to="/case"
              className="inline-flex items-center gap-1 text-base text-brandcolor-textweak transition-colors hover:text-brandcolor-secondary"
            >
              <GoogleDuotoneIcon
                name="arrow_back"
                className="text-[16px] !text-current"
              />
              Home
            </Link>
            <h1 className="mt-2 text-xl font-semibold text-brandcolor-textstrong sm:text-2xl">
              {caseRow.name}
            </h1>
            <p className="mt-1 text-sm text-brandcolor-textweak">
              Last refreshed on 3 Jun 2024. Last refresh with an update 8 Jun 2025.
            </p>
          </div>

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

      <div
        className={`mx-auto w-full max-w-7xl px-6 py-6 ${
          workspaceMode ? 'flex flex-col gap-6 lg:flex-row lg:items-start' : ''
        }`}
      >
        {workspaceMode ? (
          <aside className="w-full shrink-0 rounded-md border border-brandcolor-strokeweak bg-brandcolor-white lg:sticky lg:top-6 lg:w-64">
            <nav className="flex flex-col gap-4 p-3" aria-label="Case tools">
              {CASE_SIDEBAR_GROUPS.map((group) => (
                <div key={group}>
                  <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wide text-brandcolor-textweak">
                    {group}
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {getCaseSectionsByGroup(group).map((item) => {
                      const isActive = item.id === activeSection.id
                      return (
                        <li key={item.id}>
                          <Link
                            to={`/case-detail/${caseRow.id}/${item.id}`}
                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                              isActive
                                ? 'bg-brandcolor-secondaryfill font-medium text-brandcolor-secondary'
                                : 'text-brandcolor-textweak hover:bg-brandcolor-fill hover:text-brandcolor-textstrong'
                            }`}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            <GoogleDuotoneIcon
                              name={item.icon}
                              className={`text-[18px] ${
                                isActive
                                  ? '!text-brandcolor-secondary'
                                  : '!text-brandcolor-strokestrong'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>
        ) : null}

        <div className="min-w-0 flex-1">
          {activeSection.id === 'start-here' ? (
            <CaseStartHereLayout caseRow={caseRow} />
          ) : (
            <div className="rounded-md border border-brandcolor-strokeweak bg-brandcolor-white p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <GoogleDuotoneIcon
                  name={activeSection.icon}
                  className="text-[24px] !text-brandcolor-strokestrong"
                />
                <h2 className="text-lg font-semibold text-brandcolor-textstrong">
                  {activeSection.label}
                </h2>
              </div>
              <p className="mt-2 text-sm text-brandcolor-textweak">
                Content for this section will be available soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
