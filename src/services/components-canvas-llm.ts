import type { CanvasNode } from '@/lib/canvas-types'

export type PlanRequest = {
  prompt: string
  mentionedIds: string[]
  history: { role: 'user' | 'assistant'; content: string }[]
  extendedDesignContext: boolean
  spacingEnforcement: boolean
  themeSnapshot: Record<string, string>
}

export type PlanNode = {
  kind: CanvasNode['kind']
  label?: string
  title?: string
  subtitle?: string
  body?: string
  html?: string
  trailingIconKey?: string
  searchPlaceholder?: string
  neutralButtonLabel?: string
  sections?: { heading: string; items: { label: string; iconKey?: string }[] }[]
  navSections?: { title: string; items: { label: string; iconKey?: string }[] }[]
  x?: number
  y?: number
}

export type PlanResponse = {
  plan: { version: number; nodes: PlanNode[] }
  nodes?: PlanNode[]
}

export async function postCanvasPlan(request: PlanRequest): Promise<PlanResponse> {
  const response = await fetch('/canvas/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: request.prompt,
      messages: request.history,
      extended_design_context: request.extendedDesignContext,
      theme_snapshot: request.themeSnapshot,
      canvas_references: request.mentionedIds.map((id) => ({ id })),
      spacing_enforcement: request.spacingEnforcement,
    }),
  })
  if (!response.ok) {
    throw new Error(`Plan failed (${String(response.status)})`)
  }
  const payload = (await response.json()) as PlanResponse
  if (!payload.nodes && payload.plan?.nodes) {
    return { ...payload, nodes: payload.plan.nodes }
  }
  return payload
}
