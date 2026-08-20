export type GenerateHtmlRequest = {
  prompt: string
  mentionedIds: string[]
  history: { role: 'user' | 'assistant'; content: string }[]
  extendedDesignContext: boolean
  spacingEnforcement: boolean
  themeSnapshot: Record<string, string>
}

export type GenerateHtmlResponse = {
  html: string
  title?: string
  label?: string
}

export async function postCanvasGenerateHtml(
  request: GenerateHtmlRequest,
): Promise<GenerateHtmlResponse> {
  const response = await fetch('/canvas/generate-html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: request.prompt,
      messages: request.history,
      extended_design_context: request.extendedDesignContext,
      theme_snapshot: request.themeSnapshot,
      spacing_enforcement: request.spacingEnforcement,
    }),
  })
  if (!response.ok) {
    throw new Error(`HTML generate failed (${String(response.status)})`)
  }
  const payload = (await response.json()) as GenerateHtmlResponse
  return { ...payload, label: payload.label ?? payload.title }
}
