import type { CanvasNode } from '@/lib/canvas-types'

export type PlanRequest = {
  prompt: string
  mentionedIds: string[]
  history: { role: 'user' | 'assistant'; content: string }[]
  extendedDesignContext: boolean
  spacingEnforcement: boolean
  themeSnapshot: Record<string, string>
}

export type PlanResponse = {
  nodes: Array<{
    kind: CanvasNode['kind']
    label?: string
    title?: string
    subtitle?: string
    body?: string
    html?: string
  }>
}

export async function postCanvasPlan(request: PlanRequest): Promise<PlanResponse> {
  await delay(450)
  const prompt = request.prompt.toLowerCase()
  if (prompt.includes('sidebar')) {
    return {
      nodes: [
        {
          kind: 'productSidebar',
          title: 'Workspace',
          label: 'Sidebar',
        },
      ],
    }
  }
  return {
    nodes: [
      {
        kind: 'card',
        title: request.prompt.slice(0, 32) || 'Planned card',
        subtitle: request.extendedDesignContext ? 'Extended context' : 'Plan',
        body: request.spacingEnforcement
          ? 'Spacing tokens enforced on this generated card.'
          : 'Generated from the plan mock.',
      },
      { kind: 'primaryButton', label: 'Continue' },
      { kind: 'neutralButton', label: 'Skip' },
    ],
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
