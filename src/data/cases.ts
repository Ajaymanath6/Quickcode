export type CaseRow = {
  id: string
  name: string
  created: string
  status: string
  files: number
  usedGb: number
  recentUsed?: boolean
}

export const CASES: CaseRow[] = [
  {
    id: '1',
    name: 'Acme Corp discovery',
    created: '12 Jan 2026',
    status: 'Active',
    files: 1240,
    usedGb: 2.4,
    recentUsed: true,
  },
  {
    id: '2',
    name: 'Smith v. Jones',
    created: '28 Dec 2025',
    status: 'Active',
    files: 386,
    usedGb: 0.89,
  },
  {
    id: '3',
    name: 'Internal review — Q4',
    created: '03 Nov 2025',
    status: 'Archived',
    files: 512,
    usedGb: 1.1,
  },
  {
    id: '4',
    name: 'Patent portfolio dump',
    created: '19 Oct 2025',
    status: 'Active',
    files: 2890,
    usedGb: 5.6,
  },
  {
    id: '5',
    name: 'HR mailbox export',
    created: '02 Sep 2025',
    status: 'Processing',
    files: 158,
    usedGb: 0.34,
  },
  {
    id: '6',
    name: 'Northwind contract set',
    created: '21 Aug 2025',
    status: 'Active',
    files: 742,
    usedGb: 1.8,
  },
  {
    id: '7',
    name: 'Board minutes archive',
    created: '14 Jul 2025',
    status: 'Archived',
    files: 94,
    usedGb: 0.62,
  },
  {
    id: '8',
    name: 'Litigation hold — West',
    created: '30 Jun 2025',
    status: 'Active',
    files: 1654,
    usedGb: 3.2,
  },
  {
    id: '9',
    name: 'Vendor diligence pack',
    created: '11 May 2025',
    status: 'Processing',
    files: 421,
    usedGb: 0.98,
  },
  {
    id: '10',
    name: 'Email custodian set A',
    created: '02 Apr 2025',
    status: 'Active',
    files: 2103,
    usedGb: 4.1,
  },
  {
    id: '11',
    name: 'Merger docs — Phase 1',
    created: '18 Mar 2025',
    status: 'Active',
    files: 1330,
    usedGb: 2.9,
  },
  {
    id: '12',
    name: 'Compliance audit 2024',
    created: '09 Feb 2025',
    status: 'Archived',
    files: 688,
    usedGb: 1.5,
  },
  {
    id: '13',
    name: 'Product liability files',
    created: '27 Jan 2025',
    status: 'Active',
    files: 3412,
    usedGb: 7.0,
  },
  {
    id: '14',
    name: 'IP portfolio scan',
    created: '08 Dec 2024',
    status: 'Processing',
    files: 205,
    usedGb: 0.45,
  },
  {
    id: '15',
    name: 'Legacy PST import',
    created: '15 Nov 2024',
    status: 'Archived',
    files: 4820,
    usedGb: 9.3,
  },
]

export const STORAGE_LIMIT_GB = 10

export function getCaseById(id: string): CaseRow | undefined {
  return CASES.find((row) => row.id === id)
}

export function formatUsedGb(usedGb: number) {
  return Number.isInteger(usedGb) ? `${usedGb}` : usedGb.toFixed(2).replace(/\.?0+$/, '')
}
