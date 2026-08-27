import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { CaseRow } from '@/data/cases'
import type { CaseSectionId } from '@/data/caseSections'
import { CASE_SIDEBAR_GROUPS, getCaseSectionsByGroup } from '@/data/caseSections'
import GoogleDuotoneIcon from '@/components/GoogleDuotoneIcon'

type CaseWorkspaceLayoutProps = {
  caseRow: CaseRow
  activeSectionId: CaseSectionId
  children: ReactNode
}

export default function CaseWorkspaceLayout({
  caseRow,
  activeSectionId,
  children,
}: CaseWorkspaceLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 rounded-md border border-brandcolor-strokeweak bg-brandcolor-white lg:sticky lg:top-6 lg:w-64">
        <nav className="flex flex-col gap-4 p-3" aria-label="Case tools">
          {CASE_SIDEBAR_GROUPS.map((group) => (
            <div key={group}>
              <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wide text-brandcolor-textweak">
                {group}
              </p>
              <ul className="flex flex-col gap-0.5">
                {getCaseSectionsByGroup(group).map((item) => {
                  const isActive = item.id === activeSectionId
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

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
