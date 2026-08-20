import {
  SCALE_MAX,
  SCALE_MIN,
  WORLD_H,
  WORLD_W,
} from '@/lib/canvas-types'
import type { CanvasNode, Rect, ViewportState } from '@/lib/canvas-types'
import { nodeRect } from '@/lib/canvas-node-size'

export function clampScale(scale: number): number {
  return Math.min(SCALE_MAX, Math.max(SCALE_MIN, scale))
}

export function zoomToward(
  viewport: ViewportState,
  factor: number,
  originX: number,
  originY: number,
): ViewportState {
  const nextScale = clampScale(viewport.scale * factor)
  const wx = (originX - viewport.tx) / viewport.scale
  const wy = (originY - viewport.ty) / viewport.scale
  return {
    scale: nextScale,
    tx: originX - wx * nextScale,
    ty: originY - wy * nextScale,
  }
}

export function screenToWorld(
  viewport: ViewportState,
  screenX: number,
  screenY: number,
): { x: number; y: number } {
  return {
    x: (screenX - viewport.tx) / viewport.scale,
    y: (screenY - viewport.ty) / viewport.scale,
  }
}

function boundsOfRects(rects: Rect[]): Rect | null {
  if (rects.length === 0) {
    return null
  }
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const rect of rects) {
    minX = Math.min(minX, rect.x)
    minY = Math.min(minY, rect.y)
    maxX = Math.max(maxX, rect.x + rect.width)
    maxY = Math.max(maxY, rect.y + rect.height)
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}

export function fitViewportToNodes(
  nodes: CanvasNode[],
  viewWidth: number,
  viewHeight: number,
  padding = 80,
): ViewportState {
  const bounds =
    boundsOfRects(nodes.map(nodeRect)) ??
    ({ x: 0, y: 0, width: WORLD_W, height: WORLD_H } satisfies Rect)
  const bw = Math.max(bounds.width, 1)
  const bh = Math.max(bounds.height, 1)
  const scale = clampScale(
    Math.min((viewWidth - padding * 2) / bw, (viewHeight - padding * 2) / bh),
  )
  const tx = (viewWidth - bw * scale) / 2 - bounds.x * scale
  const ty = (viewHeight - bh * scale) / 2 - bounds.y * scale
  return { tx, ty, scale }
}
