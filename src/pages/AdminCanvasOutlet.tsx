import { useSearchParams } from 'react-router-dom'
import { CanvasChromeProvider } from '@/context/CanvasChromeContext'
import { ComponentsCanvasAiProvider } from '@/context/ComponentsCanvasAiContext'
import ComponentsCanvasSurface from '@/components/canvas/ComponentsCanvasSurface'
import LayoutWorkspace from '@/pages/LayoutWorkspace'

export default function AdminCanvasOutlet() {
  const [params] = useSearchParams()
  const layoutMode = params.get('view') === 'layout'

  if (layoutMode) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <LayoutWorkspace />
      </div>
    )
  }

  return (
    <CanvasChromeProvider>
      <ComponentsCanvasAiProvider>
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          <ComponentsCanvasSurface />
        </div>
      </ComponentsCanvasAiProvider>
    </CanvasChromeProvider>
  )
}
