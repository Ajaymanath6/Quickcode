import type { ComponentType } from 'react'
import type { CaseRow } from '@/data/cases'
import type { CaseSectionId } from '@/data/caseSections'
import CaseStartHereLayout from '@/layouts/CaseStartHereLayout'
import CaseSummaryLayout from '@/layouts/CaseSummaryLayout'
import CaseAnalyticsLayout from '@/layouts/CaseAnalyticsLayout'
import CaseActivityLayout from '@/layouts/CaseActivityLayout'
import CaseAuditLogLayout from '@/layouts/CaseAuditLogLayout'
import CaseAddOnServicesLayout from '@/layouts/CaseAddOnServicesLayout'
import CaseFilesLayout from '@/layouts/CaseFilesLayout'
import CaseUploadLayout from '@/layouts/CaseUploadLayout'
import CaseSearchLayout from '@/layouts/CaseSearchLayout'
import CaseAdvancedSearchLayout from '@/layouts/CaseAdvancedSearchLayout'
import CaseAdvancedSearchMdLayout from '@/layouts/CaseAdvancedSearchMdLayout'
import CaseDeDupeLayout from '@/layouts/CaseDeDupeLayout'
import CaseReviewSetsLayout from '@/layouts/CaseReviewSetsLayout'
import CaseIssuesLayout from '@/layouts/CaseIssuesLayout'
import CaseTagsLayout from '@/layouts/CaseTagsLayout'
import CaseProductionsImportsLayout from '@/layouts/CaseProductionsImportsLayout'
import CaseProductsLayout from '@/layouts/CaseProductsLayout'
import CaseReportsDocumentKitsLayout from '@/layouts/CaseReportsDocumentKitsLayout'
import CaseSharingLayout from '@/layouts/CaseSharingLayout'
import CaseSettingsLayout from '@/layouts/CaseSettingsLayout'

type CaseSectionLayoutProps = {
  caseRow: CaseRow
}

type CaseSectionLayoutComponent = ComponentType<CaseSectionLayoutProps>

export const CASE_SECTION_LAYOUTS: Record<CaseSectionId, CaseSectionLayoutComponent> = {
  'start-here': CaseStartHereLayout,
  summary: CaseSummaryLayout,
  analytics: CaseAnalyticsLayout,
  activity: CaseActivityLayout,
  'audit-log': CaseAuditLogLayout,
  'add-on-services': CaseAddOnServicesLayout,
  files: CaseFilesLayout,
  upload: CaseUploadLayout,
  search: CaseSearchLayout,
  'advanced-search': CaseAdvancedSearchLayout,
  'advanced-search-md': CaseAdvancedSearchMdLayout,
  'de-dupe': CaseDeDupeLayout,
  'review-sets': CaseReviewSetsLayout,
  issues: CaseIssuesLayout,
  tags: CaseTagsLayout,
  'productions-imports': CaseProductionsImportsLayout,
  products: CaseProductsLayout,
  'reports-document-kits': CaseReportsDocumentKitsLayout,
  sharing: CaseSharingLayout,
  settings: CaseSettingsLayout,
}

export function getCaseSectionLayout(id: CaseSectionId): CaseSectionLayoutComponent {
  return CASE_SECTION_LAYOUTS[id]
}
