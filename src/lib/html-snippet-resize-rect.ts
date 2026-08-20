import type { Rect } from '@/lib/canvas-types'

export type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const MIN_W = 120
const MIN_H = 80

export function applyHtmlSnippetResize(
  start: Rect,
  edge: ResizeEdge,
  dx: number,
  dy: number,
): Rect {
  let { x, y, width, height } = start

  if (edge.includes('e')) {
    width = Math.max(MIN_W, start.width + dx)
  }
  if (edge.includes('w')) {
    width = Math.max(MIN_W, start.width - dx)
    x = start.x + start.width - width
  }
  if (edge.includes('s')) {
    height = Math.max(MIN_H, start.height + dy)
  }
  if (edge.includes('n')) {
    height = Math.max(MIN_H, start.height - dy)
    y = start.y + start.height - height
  }

  return { x, y, width, height }
}

export function cursorForResizeEdge(edge: ResizeEdge): string {
  switch (edge) {
    case 'n':
    case 's':
      return 'ns-resize'
    case 'e':
    case 'w':
      return 'ew-resize'
    case 'ne':
    case 'sw':
      return 'nesw-resize'
    case 'nw':
    case 'se':
      return 'nwse-resize'
    default: {
      const _never: never = edge
      return _never
    }
  }
}
