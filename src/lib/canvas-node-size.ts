import type { CanvasNode, Size } from '@/lib/canvas-types'

const DEFAULT_HTML_WIDTH = 320
const DEFAULT_HTML_HEIGHT = 200

export function nodeSize(node: CanvasNode): Size {
  switch (node.kind) {
    case 'card':
      return { width: 280, height: 168 }
    case 'primaryButton':
    case 'secondaryButton':
    case 'neutralButton':
      return { width: 220, height: 72 }
    case 'confirmPasswordInput':
    case 'textInputField':
      return { width: 260, height: 96 }
    case 'productSidebar':
      return { width: 240, height: 360 }
    case 'htmlSnippet':
      return {
        width: node.widthPx ?? DEFAULT_HTML_WIDTH,
        height: node.shellHeightPx ?? DEFAULT_HTML_HEIGHT,
      }
    default: {
      const _never: never = node
      return _never
    }
  }
}

export function nodeRect(node: CanvasNode): {
  x: number
  y: number
  width: number
  height: number
} {
  const size = nodeSize(node)
  return { x: node.x, y: node.y, width: size.width, height: size.height }
}
