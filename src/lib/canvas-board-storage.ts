import type { CanvasNode } from '@/lib/canvas-types'

const BOARD_KEY = 'quickcode.canvas.board'

function seedBoard(): CanvasNode[] {
  return [
    {
      id: crypto.randomUUID(),
      kind: 'card',
      x: 120,
      y: 120,
      title: 'Product card',
      subtitle: 'Catalog preview',
      body: 'A compact card used across marketing and admin surfaces.',
    },
    {
      id: crypto.randomUUID(),
      kind: 'primaryButton',
      x: 440,
      y: 120,
      label: 'Primary action',
    },
    {
      id: crypto.randomUUID(),
      kind: 'secondaryButton',
      x: 440,
      y: 220,
      label: 'Secondary action',
    },
    {
      id: crypto.randomUUID(),
      kind: 'neutralButton',
      x: 440,
      y: 320,
      label: 'Neutral action',
    },
    {
      id: crypto.randomUUID(),
      kind: 'confirmPasswordInput',
      x: 120,
      y: 340,
      label: 'Confirm password',
    },
    {
      id: crypto.randomUUID(),
      kind: 'textInputField',
      x: 120,
      y: 470,
      label: 'Display name',
    },
  ]
}

export function loadBoard(): CanvasNode[] {
  try {
    const raw = localStorage.getItem(BOARD_KEY)
    if (!raw) {
      const seeded = seedBoard()
      saveBoard(seeded)
      return seeded
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = seedBoard()
      saveBoard(seeded)
      return seeded
    }
    return parsed as CanvasNode[]
  } catch {
    return seedBoard()
  }
}

export function saveBoard(nodes: CanvasNode[]): void {
  localStorage.setItem(BOARD_KEY, JSON.stringify(nodes))
}
