import type { Rect } from '@/lib/canvas-types'

export default function CanvasGenerationSkeleton({ rect }: { rect: Rect }) {
  return (
    <div
      className="pointer-events-none absolute animate-pulse rounded-xl border border-dashed border-brandcolor-strokeweak bg-white/80"
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      }}
    >
      <div className="m-3 h-3 w-2/3 rounded bg-brandcolor-neutralhover" />
      <div className="mx-3 h-3 w-1/2 rounded bg-brandcolor-neutralhover" />
    </div>
  )
}
