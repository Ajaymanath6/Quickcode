export const DEFAULT_CASE_SECTION = 'start-here' as const

export const CASE_SECTIONS = [
  { id: 'start-here', label: 'Start here', icon: 'home', group: 'Overview' },
  { id: 'summary', label: 'Summary', icon: 'summarize', group: 'Overview' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics', group: 'Overview' },
  { id: 'activity', label: 'Activity', icon: 'timeline', group: 'Overview' },
  { id: 'audit-log', label: 'Audit log', icon: 'history', group: 'Overview' },
  { id: 'add-on-services', label: 'Add-on services', icon: 'extension', group: 'Overview' },
  { id: 'files', label: 'Files', icon: 'folder', group: 'Find & process' },
  { id: 'upload', label: 'Upload', icon: 'upload_file', group: 'Find & process' },
  { id: 'search', label: 'Search', icon: 'search', group: 'Find & process' },
  { id: 'advanced-search', label: 'Advanced search', icon: 'manage_search', group: 'Find & process' },
  { id: 'advanced-search-md', label: 'Advanced search MD', icon: 'find_in_page', group: 'Find & process' },
  { id: 'de-dupe', label: 'De-dupe', icon: 'content_copy', group: 'Find & process' },
  { id: 'review-sets', label: 'Review sets', icon: 'rate_review', group: 'Review & produce' },
  { id: 'issues', label: 'Issues', icon: 'flag', group: 'Review & produce' },
  { id: 'tags', label: 'Tags', icon: 'sell', group: 'Review & produce' },
  {
    id: 'productions-imports',
    label: 'Productions & imports',
    icon: 'inventory_2',
    group: 'Review & produce',
  },
  { id: 'products', label: 'Products', icon: 'category', group: 'Review & produce' },
  {
    id: 'reports-document-kits',
    label: 'Reports & document kits',
    icon: 'description',
    group: 'Review & produce',
  },
  { id: 'sharing', label: 'Sharing', icon: 'group', group: 'Admin' },
  { id: 'settings', label: 'Settings', icon: 'settings', group: 'Admin' },
] as const

export type CaseSectionId = (typeof CASE_SECTIONS)[number]['id']
export type CaseSection = (typeof CASE_SECTIONS)[number]
export type CaseSectionGroup = CaseSection['group']

export const CASE_SECTION_GROUPS: CaseSectionGroup[] = [
  'Overview',
  'Find & process',
  'Review & produce',
  'Admin',
]

/** Work-tool groups only — Overview renders as horizontal tabs. */
export const CASE_SIDEBAR_GROUPS: CaseSectionGroup[] = [
  'Find & process',
  'Review & produce',
  'Admin',
]

export function isCaseSectionId(value: string | undefined): value is CaseSectionId {
  return CASE_SECTIONS.some((section) => section.id === value)
}

export function getCaseSection(id: string | undefined): CaseSection | undefined {
  return CASE_SECTIONS.find((section) => section.id === id)
}

export function getCaseSectionsByGroup(group: CaseSectionGroup): CaseSection[] {
  return CASE_SECTIONS.filter((section) => section.group === group)
}

export function getOverviewSections(): CaseSection[] {
  return getCaseSectionsByGroup('Overview')
}

export const DEFAULT_WORKSPACE_SECTION = 'files' as const

export const WORKSPACE_TOP_TAB = {
  id: 'workspace',
  label: 'Workspace',
} as const

export type CaseTopTab =
  | { kind: 'overview'; id: CaseSectionId; label: string }
  | { kind: 'workspace'; id: typeof WORKSPACE_TOP_TAB.id; label: string }

export function getCaseTopTabs(): CaseTopTab[] {
  return [
    ...getOverviewSections().map((section) => ({
      kind: 'overview' as const,
      id: section.id,
      label: section.label,
    })),
    {
      kind: 'workspace' as const,
      id: WORKSPACE_TOP_TAB.id,
      label: WORKSPACE_TOP_TAB.label,
    },
  ]
}

export function isWorkspaceSection(section: CaseSection): boolean {
  return section.group !== 'Overview'
}
