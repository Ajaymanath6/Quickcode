import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiArrowDownSFill, RiArrowUpSFill } from '@remixicon/react'
import GoogleDuotoneIcon from '@/components/GoogleDuotoneIcon'
import { CASES, STORAGE_LIMIT_GB, formatUsedGb } from '@/data/cases'

const HEADER_CELL = 'px-4 py-4 font-medium'
const DATE_FILES_COL = 'w-[160px] min-w-[160px]'
const DATA_BADGE =
  'inline-flex rounded-md border border-brandcolor-strokeweak bg-brandcolor-fill px-2.5 py-1 text-sm text-brandcolor-textstrong'

type SortKey = 'name' | 'created' | 'files' | 'storage'
type SortDir = 'asc' | 'desc'

function SortChevrons({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className="ml-1 inline-flex flex-col leading-none" aria-hidden>
      <RiArrowUpSFill
        className={`-mb-1 size-3.5 ${active && dir === 'asc' ? 'text-brandcolor-textstrong' : 'text-brandcolor-textweak/50'}`}
      />
      <RiArrowDownSFill
        className={`-mt-1 size-3.5 ${active && dir === 'desc' ? 'text-brandcolor-textstrong' : 'text-brandcolor-textweak/50'}`}
      />
    </span>
  )
}

export default function CaseListTable() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const rows = useMemo(() => {
    if (!sortKey) return CASES
    const sorted = [...CASES].sort((a, b) => {
      if (sortKey === 'files') return a.files - b.files
      if (sortKey === 'storage') return a.usedGb - b.usedGb
      return a[sortKey].localeCompare(b[sortKey], undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    })
    return sortDir === 'asc' ? sorted : sorted.reverse()
  }, [sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setSortDir('asc')
  }

  return (
    <div className="overflow-hidden rounded-t-md border border-brandcolor-strokeweak bg-brandcolor-white p-4">
      <table className="w-full border-collapse text-left text-sm text-brandcolor-textstrong">
        <thead>
          <tr className="border-b border-brandcolor-strokeweak bg-brandcolor-table-header/40">
            <th className={`${HEADER_CELL} rounded-tl-md`}>
              <button
                type="button"
                className="inline-flex items-center"
                onClick={() => toggleSort('name')}
              >
                Case name
                <SortChevrons active={sortKey === 'name'} dir={sortDir} />
              </button>
            </th>
            <th className={`${HEADER_CELL} ${DATE_FILES_COL}`}>
              <button
                type="button"
                className="inline-flex items-center"
                onClick={() => toggleSort('created')}
              >
                Created Date
                <SortChevrons active={sortKey === 'created'} dir={sortDir} />
              </button>
            </th>
            <th className={`${HEADER_CELL} ${DATE_FILES_COL}`}>
              <button
                type="button"
                className="inline-flex items-center"
                onClick={() => toggleSort('files')}
              >
                Files
                <SortChevrons active={sortKey === 'files'} dir={sortDir} />
              </button>
            </th>
            <th className={`${HEADER_CELL} w-[300px] min-w-[300px]`}>
              <button
                type="button"
                className="inline-flex items-center"
                onClick={() => toggleSort('storage')}
              >
                Storage
                <SortChevrons active={sortKey === 'storage'} dir={sortDir} />
              </button>
            </th>
            <th className={`${HEADER_CELL} rounded-tr-md`}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const usagePercent = Math.min(100, (row.usedGb / STORAGE_LIMIT_GB) * 100)
            return (
              <tr key={row.id} className="border-b border-brandcolor-strokeweak last:border-b-0">
                <td className="border-x border-brandcolor-strokelight px-4 py-4 font-semibold">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/case-detail/${row.id}/start-here`}
                      className="inline-flex cursor-pointer items-center gap-2 text-brandcolor-textstrong transition-colors hover:text-brandcolor-secondary"
                    >
                      <GoogleDuotoneIcon
                        name="folder"
                        className="text-[22px] !text-brandcolor-strokestrong"
                      />
                      <span className="hover:underline">{row.name}</span>
                    </Link>
                    {row.recentUsed ? (
                      <span className="inline-flex rounded-md border border-brandcolor-secondary px-2 py-0.5 text-xs font-medium text-brandcolor-secondary">
                        Recent used
                      </span>
                    ) : null}
                  </div>
                </td>
                <td
                  className={`${DATE_FILES_COL} border-x border-brandcolor-strokelight px-4 py-4`}
                >
                  <span className={DATA_BADGE}>{row.created}</span>
                </td>
                <td
                  className={`${DATE_FILES_COL} border-x border-brandcolor-strokelight px-4 py-4`}
                >
                  <div className="inline-flex items-center gap-1.5 text-brandcolor-textweak">
                    <GoogleDuotoneIcon
                      name="description"
                      className="text-[18px] !text-brandcolor-strokestrong"
                    />
                    <span className="font-semibold">{row.files.toLocaleString()}</span>
                  </div>
                </td>
                <td className="w-[300px] min-w-[300px] border-x border-brandcolor-strokelight px-4 py-4">
                  <div className="flex flex-col gap-1.5">
                    <span className={DATA_BADGE}>
                      {formatUsedGb(row.usedGb)} GB / {STORAGE_LIMIT_GB} GB
                    </span>
                    <div
                      className="h-2 w-full overflow-hidden rounded-sm bg-brandcolor-fill"
                      role="progressbar"
                      aria-valuenow={Math.round(usagePercent)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${row.name} storage usage`}
                    >
                      <div
                        className="h-full rounded-sm bg-brandcolor-secondary"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="border-x border-brandcolor-strokelight px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-brandcolor-strokeweak bg-brandcolor-white px-3 py-1.5 text-sm font-medium text-brandcolor-textstrong transition-colors hover:bg-brandcolor-neutralhover"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-brandcolor-destructive px-3 py-1.5 text-sm font-medium text-brandcolor-white transition-colors hover:opacity-90"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export const CASE_LIST_COUNT = CASES.length
