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
  label?: string
}

export async function postCanvasGenerateHtml(
  request: GenerateHtmlRequest,
): Promise<GenerateHtmlResponse> {
  await delay(450)
  const pad = request.spacingEnforcement ? 'p-6' : 'p-4'
  const html = `<section class="${pad} rounded-lg border border-brandcolor-200 bg-white">
  <p class="text-xs uppercase tracking-wide text-brandcolor-500">HTML creator</p>
  <h2 class="mt-1 text-lg font-semibold text-brandcolor-900">${escapeText(request.prompt.slice(0, 48) || 'Generated block')}</h2>
  <p class="mt-2 text-sm text-brandcolor-700">Mock fragment using theme tokens. Mentioned ${String(request.mentionedIds.length)} block(s).</p>
  <button type="button" class="mt-4 rounded-md bg-brandcolor-700 px-3 py-1.5 text-sm text-white">Action</button>
</section>`
  return { html, label: request.prompt.slice(0, 24) || 'HTML snippet' }
}

function escapeText(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
