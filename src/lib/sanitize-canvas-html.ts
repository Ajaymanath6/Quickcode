import DOMPurify from 'dompurify'

export function sanitizeCanvasHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['class', 'style'],
  })
}
