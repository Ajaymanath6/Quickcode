import type { CanvasNode, NavSection } from '@/lib/canvas-types'

type PlanNode = {
  kind: CanvasNode['kind']
  x?: number
  y?: number
  title?: string
  subtitle?: string
  body?: string
  label?: string
  html?: string
  trailingIconKey?: string
  searchPlaceholder?: string
  neutralButtonLabel?: string
  navSections?: NavSection[]
  sections?: { heading: string; items: { label: string; iconKey?: string }[] }[]
}

export function mapCanvasPlanToNodes(
  planNodes: PlanNode[],
  originX: number,
  originY: number,
): CanvasNode[] {
  return planNodes.map((item, index) => {
    const x = item.x ?? originX + (index % 3) * 300
    const y = item.y ?? originY + Math.floor(index / 3) * 200
    const id = crypto.randomUUID()
    switch (item.kind) {
      case 'card':
        return {
          id,
          kind: 'card',
          x,
          y,
          title: item.title ?? 'Generated card',
          subtitle: item.subtitle ?? 'From plan',
          body: item.body ?? 'Generated from the canvas plan.',
        }
      case 'primaryButton':
        return { id, kind: 'primaryButton', x, y, label: item.label ?? 'Primary' }
      case 'secondaryButton':
        return { id, kind: 'secondaryButton', x, y, label: item.label ?? 'Secondary' }
      case 'neutralButton':
        return { id, kind: 'neutralButton', x, y, label: item.label ?? 'Neutral' }
      case 'confirmPasswordInput':
        return {
          id,
          kind: 'confirmPasswordInput',
          x,
          y,
          label: item.label ?? 'Confirm password',
        }
      case 'textInputField':
        return { id, kind: 'textInputField', x, y, label: item.label ?? 'Text field' }
      case 'productSidebar':
        return {
          id,
          kind: 'productSidebar',
          x,
          y,
          title: item.title ?? 'Menu',
          trailingIconKey: item.trailingIconKey ?? 'settings',
          searchPlaceholder: item.searchPlaceholder ?? 'Search',
          neutralButtonLabel: item.neutralButtonLabel ?? 'New',
          navSections:
            item.navSections ??
            (item.sections && item.sections.length > 0
              ? item.sections.map((section) => ({
                  title: section.heading,
                  items: section.items,
                }))
              : [{ title: 'Main', items: [{ label: 'Home', iconKey: 'home' }] }]),
        }
      case 'htmlSnippet':
        return {
          id,
          kind: 'htmlSnippet',
          x,
          y,
          label: item.label ?? 'HTML frame',
          html: item.html ?? '<div class="p-4 text-sm">Empty frame</div>',
          widthPx: 280,
          shellHeightPx: 160,
        }
      default:
        return {
          id,
          kind: 'card',
          x,
          y,
          title: 'Untitled',
          subtitle: 'Plan',
          body: 'Unrecognized plan node.',
        }
    }
  })
}
