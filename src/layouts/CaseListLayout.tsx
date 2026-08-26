import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import CaseListTable, { CASE_LIST_COUNT } from '@/components/CaseListTable'
import CaseSearchBar from '@/components/CaseSearchBar'
import GoogleDuotoneIcon from '@/components/GoogleDuotoneIcon'
import Pagination from '@/components/Pagination'

type CaseListLayoutProps = {
  children?: ReactNode
}

export default function CaseListLayout({ children }: CaseListLayoutProps) {
  return (
    <div className="font-lato">
      <div className="w-full px-6 py-8">
        <div className="mx-auto w-full max-w-7xl">
          <CaseSearchBar />
        </div>
      </div>

      <div className="w-full border-b border-brandcolor-strokeweak" aria-hidden />

      <div className="mx-auto w-full max-w-7xl px-6 pb-6 pt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex min-w-7 items-center justify-center rounded-md border border-brandcolor-strokeweak bg-brandcolor-white px-2 py-0.5 text-sm font-medium text-brandcolor-textstrong">
              {CASE_LIST_COUNT}
            </span>
            <span className="text-base text-brandcolor-textstrong">cases</span>
          </div>

          <Link
            to="/new-case"
            className="inline-flex items-center gap-1.5 rounded-md bg-brandcolor-secondary px-4 py-2 text-sm font-semibold text-brandcolor-white transition-colors hover:bg-brandcolor-secondaryhover"
          >
            <GoogleDuotoneIcon name="add" className="text-[18px] !text-brandcolor-white" />
            Add new case
          </Link>
        </div>

        <CaseListTable />
        <div className="mt-6">
          <Pagination />
        </div>
        {children}
      </div>
    </div>
  )
}
