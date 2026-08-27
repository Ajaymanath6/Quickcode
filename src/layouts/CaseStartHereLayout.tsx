import type { CaseRow } from '@/data/cases'
import { STORAGE_LIMIT_GB, formatUsedGb } from '@/data/cases'

type CaseStartHereLayoutProps = {
  caseRow: CaseRow
}

export default function CaseStartHereLayout({ caseRow }: CaseStartHereLayoutProps) {
  const usagePercent = Math.min(100, (caseRow.usedGb / STORAGE_LIMIT_GB) * 100)

  return (
    <div className="rounded-md border border-brandcolor-strokeweak bg-brandcolor-white p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-brandcolor-textstrong">Welcome to your case</h2>
      <p className="mt-2 max-w-2xl text-sm text-brandcolor-textweak sm:text-base">
        Use this workspace to review documents, track activity, and manage add-on services for{' '}
        <span className="font-medium text-brandcolor-textstrong">{caseRow.name}</span>.
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-brandcolor-strokeweak bg-brandcolor-fill px-4 py-3">
          <dt className="text-xs text-brandcolor-textweak">Created</dt>
          <dd className="mt-1 text-sm font-semibold text-brandcolor-textstrong">
            {caseRow.created}
          </dd>
        </div>
        <div className="rounded-md border border-brandcolor-strokeweak bg-brandcolor-fill px-4 py-3">
          <dt className="text-xs text-brandcolor-textweak">Files</dt>
          <dd className="mt-1 text-sm font-semibold text-brandcolor-textstrong">
            {caseRow.files.toLocaleString()}
          </dd>
        </div>
        <div className="rounded-md border border-brandcolor-strokeweak bg-brandcolor-fill px-4 py-3">
          <dt className="text-xs text-brandcolor-textweak">Storage</dt>
          <dd className="mt-1 text-sm font-semibold text-brandcolor-textstrong">
            {formatUsedGb(caseRow.usedGb)} GB / {STORAGE_LIMIT_GB} GB
          </dd>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-sm bg-brandcolor-white"
            role="progressbar"
            aria-valuenow={Math.round(usagePercent)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-sm bg-brandcolor-secondary"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </dl>
    </div>
  )
}
