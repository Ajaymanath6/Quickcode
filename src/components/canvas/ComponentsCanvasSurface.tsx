import { useCallback, useEffect, useRef, useState } from 'react'
import type { DragEvent as ReactDragEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import {
  RiCursorLine,
  RiCheckboxBlankLine,
  RiFocus3Line,
  RiAddLine,
  RiSubtractLine,
  RiAspectRatioLine,
  RiChat1Line,
} from '@remixicon/react'
import { useSearchParams } from 'react-router-dom'
import CanvasGenerationSkeleton from '@/components/canvas/CanvasGenerationSkeleton'
import CanvasPublishModal, {
  CanvasCodeModal,
} from '@/components/canvas/CanvasPublishModal'
import CanvasWorldBlock from '@/components/canvas/CanvasWorldBlock'
import ComponentsCanvasPromptPanel from '@/components/canvas/ComponentsCanvasPromptPanel'
import { useCanvasChrome } from '@/context/CanvasChromeContext'
import { useComponentsCanvasAi } from '@/context/ComponentsCanvasAiContext'
import { loadBoard, saveBoard } from '@/lib/canvas-board-storage'
import { CATALOG_DRAG_MIME, readCatalogDrag } from '@/lib/catalog-drag'
import {
  GRID_SIZE,
  SCALE_STEP,
  WORLD_H,
  WORLD_W,
} from '@/lib/canvas-types'
import type { CanvasNode, CatalogEntry, HtmlSnippetNode, Rect, ViewportState } from '@/lib/canvas-types'
import { nodeSize } from '@/lib/canvas-node-size'
import {
  blueprintForNode,
  buildSourceHtmlForCanvasNode,
  catalogIdForNode,
  isPublishedCatalogEntry,
  applyDisplayName,
} from '@/lib/canvas-node-publish'
import {
  applyHtmlSnippetResize,
  type ResizeEdge,
} from '@/lib/html-snippet-resize-rect'
import {
  fitViewportToNodes,
  screenToWorld,
  zoomToward,
} from '@/lib/canvas-viewport'
import {
  deleteCatalogEntry,
  fetchCatalogIndex,
  publishCanvasNode,
} from '@/services/publish-workflow'

function nodeToolbarLabel(node: CanvasNode): string {
  if ('label' in node && node.label) {
    return node.label
  }
  if ('title' in node) {
    return node.title
  }
  return node.kind
}

export default function ComponentsCanvasSurface() {
  const [searchParams] = useSearchParams()
  const viewportRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<CanvasNode[]>([])
  const focusedFromUrlRef = useRef<string | null>(null)
  const { tool, setTool, spaceHeld, setSpaceHeld, setHideBlockChrome, requestPromptFocus } =
    useCanvasChrome()
  const ai = useComponentsCanvasAi()

  const [nodes, setNodes] = useState<CanvasNode[]>(() => loadBoard())
  const [viewport, setViewport] = useState<ViewportState>({ tx: 48, ty: 48, scale: 1 })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [skeleton, setSkeleton] = useState<Rect | null>(null)
  const [frameDraft, setFrameDraft] = useState<Rect | null>(null)
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [catalogFailed, setCatalogFailed] = useState(false)
  const [lastGoodPublished, setLastGoodPublished] = useState<Set<string>>(new Set())
  const [optimisticPublished, setOptimisticPublished] = useState<Set<string>>(new Set())
  const [publishNode, setPublishNode] = useState<CanvasNode | null>(null)
  const [publishBusy, setPublishBusy] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [successBanner, setSuccessBanner] = useState<string | null>(null)
  const [codeNode, setCodeNode] = useState<CanvasNode | null>(null)
  const [widthDraft, setWidthDraft] = useState('')
  const [heightDraft, setHeightDraft] = useState('')
  const [isPanning, setIsPanning] = useState(false)

  const panRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null)
  const resizeRef = useRef<{
    edge: ResizeEdge
    start: Rect
    pointerX: number
    pointerY: number
    id: string
  } | null>(null)
  const frameRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  const selected = nodes.find((node) => node.id === selectedId) ?? null

  const refreshCatalog = useCallback(async () => {
    try {
      const entries = await fetchCatalogIndex()
      setCatalog(entries)
      setCatalogFailed(false)
      setLastGoodPublished(
        new Set(
          entries
            .filter((entry) => isPublishedCatalogEntry(entry))
            .map((entry) => entry.componentId),
        ),
      )
    } catch {
      setCatalogFailed(true)
    }
  }, [])

  useEffect(() => {
    void refreshCatalog()
  }, [refreshCatalog])

  useEffect(() => {
    saveBoard(nodes)
  }, [nodes])

  useEffect(() => {
    if (selected?.kind === 'htmlSnippet') {
      setWidthDraft(String(Math.round(nodeSize(selected).width)))
      setHeightDraft(String(Math.round(nodeSize(selected).height)))
    }
  }, [selected])

  const focusBlocks = useCallback((ids: string[]) => {
    const el = viewportRef.current
    if (!el) {
      return
    }
    const targets = nodesRef.current.filter((node) => ids.includes(node.id))
    if (targets.length === 0) {
      return
    }
    setSelectedId(ids[0] ?? null)
    setViewport(fitViewportToNodes(targets, el.clientWidth, el.clientHeight, 120))
  }, [])

  useEffect(() => {
    const focusId = searchParams.get('focus')
    if (!focusId || focusedFromUrlRef.current === focusId) {
      return
    }
    focusedFromUrlRef.current = focusId
    const frame = window.requestAnimationFrame(() => focusBlocks([focusId]))
    return () => window.cancelAnimationFrame(frame)
  }, [focusBlocks, searchParams])

  useEffect(() => {
    ai.registerBoardApi({
      getNodes: () => nodesRef.current,
      appendNodes: (incoming) => {
        setNodes((current) => [...current, ...incoming])
      },
      replaceNode: (id, next) => {
        setNodes((current) => current.map((node) => (node.id === id ? next : node)))
      },
      focusBlocks,
      setSkeleton,
    })
  }, [ai, focusBlocks])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat) {
        const tag = (event.target as HTMLElement | null)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') {
          return
        }
        event.preventDefault()
        setSpaceHeld(true)
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setSpaceHeld(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [setSpaceHeld])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) {
      return
    }
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = el.getBoundingClientRect()
      const factor = event.deltaY > 0 ? 1 / SCALE_STEP : SCALE_STEP
      setViewport((current) =>
        zoomToward(current, factor, event.clientX - rect.left, event.clientY - rect.top),
      )
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const isPublished = (node: CanvasNode): boolean => {
    const id = catalogIdForNode(node)
    if (optimisticPublished.has(id)) {
      return true
    }
    const source = catalogFailed ? lastGoodPublished : new Set(
      catalog
        .filter((entry) => isPublishedCatalogEntry(entry))
        .map((entry) => entry.componentId),
    )
    return source.has(id)
  }

  const zoomFromCenter = (factor: number) => {
    const el = viewportRef.current
    if (!el) {
      return
    }
    setViewport((current) =>
      zoomToward(current, factor, el.clientWidth / 2, el.clientHeight / 2),
    )
  }

  const fitAll = () => {
    const el = viewportRef.current
    if (!el) {
      return
    }
    setViewport(fitViewportToNodes(nodes, el.clientWidth, el.clientHeight))
  }

  const updateHtmlNode = (id: string, patch: Partial<HtmlSnippetNode>) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === id && node.kind === 'htmlSnippet' ? { ...node, ...patch } : node,
      ),
    )
  }

  const onHtmlContentHeight = useCallback((id: string, contentHeight: number) => {
    setNodes((current) =>
      current.map((node) => {
        if (node.id !== id || node.kind !== 'htmlSnippet') {
          return node
        }
        const currentHeight = node.shellHeightPx ?? nodeSize(node).height
        if (node.userResized) {
          if (contentHeight > currentHeight + 1) {
            return { ...node, shellHeightPx: contentHeight }
          }
          return node
        }
        const hugged = Math.max(80, contentHeight + 24)
        if (Math.abs(hugged - currentHeight) < 2) {
          return node
        }
        return { ...node, shellHeightPx: hugged }
      }),
    )
  }, [])

  const beginPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    panRef.current = {
      x: event.clientX,
      y: event.clientY,
      tx: viewport.tx,
      ty: viewport.ty,
    }
    setIsPanning(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onViewportPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const spacePan = spaceHeld && event.button === 0
    const middlePan = event.button === 1
    if (spacePan || middlePan) {
      event.preventDefault()
      beginPan(event)
      return
    }
    if (event.button !== 0) {
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const world = screenToWorld(
      viewport,
      event.clientX - rect.left,
      event.clientY - rect.top,
    )
    if (tool === 'frame') {
      frameRef.current = world
      setFrameDraft({ x: world.x, y: world.y, width: 0, height: 0 })
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }
    setSelectedId(null)
  }

  const onViewportPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (panRef.current) {
      const dx = event.clientX - panRef.current.x
      const dy = event.clientY - panRef.current.y
      setViewport((current) => ({
        ...current,
        tx: panRef.current!.tx + dx,
        ty: panRef.current!.ty + dy,
      }))
      return
    }
    if (resizeRef.current) {
      const dx = (event.clientX - resizeRef.current.pointerX) / viewport.scale
      const dy = (event.clientY - resizeRef.current.pointerY) / viewport.scale
      const next = applyHtmlSnippetResize(resizeRef.current.start, resizeRef.current.edge, dx, dy)
      updateHtmlNode(resizeRef.current.id, {
        x: next.x,
        y: next.y,
        widthPx: next.width,
        shellHeightPx: next.height,
        userResized: true,
      })
      setWidthDraft(String(Math.round(next.width)))
      setHeightDraft(String(Math.round(next.height)))
      return
    }
    if (frameRef.current) {
      const rect = event.currentTarget.getBoundingClientRect()
      const world = screenToWorld(
        viewport,
        event.clientX - rect.left,
        event.clientY - rect.top,
      )
      const x = Math.min(frameRef.current.x, world.x)
      const y = Math.min(frameRef.current.y, world.y)
      setFrameDraft({
        x,
        y,
        width: Math.abs(world.x - frameRef.current.x),
        height: Math.abs(world.y - frameRef.current.y),
      })
    }
  }

  const onViewportPointerUp = () => {
    panRef.current = null
    resizeRef.current = null
    setIsPanning(false)
    if (frameRef.current && frameDraft && frameDraft.width > 24 && frameDraft.height > 24) {
      const created: HtmlSnippetNode = {
        id: crypto.randomUUID(),
        kind: 'htmlSnippet',
        x: frameDraft.x,
        y: frameDraft.y,
        label: 'Frame',
        html: '<div class="p-4 text-sm text-brandcolor-700">Empty frame</div>',
        widthPx: frameDraft.width,
        shellHeightPx: frameDraft.height,
        userResized: true,
      }
      setNodes((current) => [...current, created])
      setSelectedId(created.id)
    }
    frameRef.current = null
    setFrameDraft(null)
  }

  const commitLayoutSize = () => {
    if (!selected || selected.kind !== 'htmlSnippet') {
      return
    }
    const width = Number(widthDraft)
    const height = Number(heightDraft)
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      return
    }
    updateHtmlNode(selected.id, {
      widthPx: Math.max(120, width),
      shellHeightPx: Math.max(80, height),
      userResized: true,
    })
  }

  const onCatalogDrop = (event: ReactDragEvent<HTMLDivElement>) => {
    const payload = readCatalogDrag(event)
    const el = viewportRef.current
    if (!payload || !el) {
      return
    }
    event.preventDefault()
    const rect = el.getBoundingClientRect()
    const world = screenToWorld(
      viewport,
      event.clientX - rect.left,
      event.clientY - rect.top,
    )
    const existing = nodesRef.current.find(
      (node) => node.kind === 'htmlSnippet' && node.catalogId === payload.catalogId,
    )
    if (existing) {
      focusBlocks([existing.id])
      return
    }
    const created: HtmlSnippetNode = {
      id: crypto.randomUUID(),
      kind: 'htmlSnippet',
      catalogId: payload.catalogId,
      x: Math.max(0, Math.min(WORLD_W - 420, world.x)),
      y: Math.max(0, Math.min(WORLD_H - 280, world.y)),
      label: payload.label,
      html: payload.sourceHtml,
      widthPx: 420,
      shellHeightPx: 280,
    }
    setNodes((current) => [...current, created])
    setSelectedId(created.id)
  }

  const handleDelete = async (node: CanvasNode) => {
    setNodes((current) => current.filter((item) => item.id !== node.id))
    setSelectedId((current) => (current === node.id ? null : current))
    const componentId = catalogIdForNode(node)
    if (isPublished(node)) {
      await deleteCatalogEntry(componentId)
      setOptimisticPublished((current) => {
        const next = new Set(current)
        next.delete(componentId)
        return next
      })
      await refreshCatalog()
    }
  }

  const handlePublish = async (values: {
    label: string
    description: string
    sealed: boolean
  }) => {
    if (!publishNode) {
      return
    }
    const named = applyDisplayName(publishNode, values.label)
    const componentId = catalogIdForNode(named)
    setPublishBusy(true)
    setPublishError(null)
    try {
      await publishCanvasNode(named, values)
      setNodes((current) => current.map((node) => (node.id === named.id ? named : node)))
      setOptimisticPublished((current) => new Set(current).add(componentId))
      setHideBlockChrome(false)
      setPublishNode(null)
      setSuccessBanner(`Published “${values.label}” to the catalog.`)
      await refreshCatalog()
      window.setTimeout(() => {
        void refreshCatalog()
      }, 400)
    } catch {
      setPublishError('Publish failed. Keep npm run dev running and try again.')
    } finally {
      setPublishBusy(false)
    }
  }

  const cursor = spaceHeld || isPanning ? 'grab' : tool === 'frame' ? 'crosshair' : 'default'

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col bg-[var(--canvas-fill)]">
      <div
        ref={viewportRef}
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{
          cursor,
          backgroundImage: `linear-gradient(to right, var(--canvas-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--canvas-grid) 1px, transparent 1px)`,
          backgroundSize: `${String(GRID_SIZE)}px ${String(GRID_SIZE)}px`,
        }}
        onPointerDown={onViewportPointerDown}
        onPointerMove={onViewportPointerMove}
        onPointerUp={onViewportPointerUp}
        onPointerCancel={onViewportPointerUp}
        onDragOver={(event) => {
          if (Array.from(event.dataTransfer.types).includes(CATALOG_DRAG_MIME)) {
            event.preventDefault()
            event.dataTransfer.dropEffect = 'copy'
          }
        }}
        onDrop={onCatalogDrop}
        onContextMenu={(event) => event.preventDefault()}
      >
        <div
          className="absolute origin-top-left"
          style={{
            width: WORLD_W,
            height: WORLD_H,
            transform: `translate(${String(viewport.tx)}px, ${String(viewport.ty)}px) scale(${String(viewport.scale)})`,
            transformOrigin: '0 0',
          }}
        >
          {nodes.map((node) => (
            <CanvasWorldBlock
              key={node.id}
              node={node}
              selected={node.id === selectedId}
              published={isPublished(node)}
              scale={viewport.scale}
              onSelect={() => setSelectedId(node.id)}
              onMove={(dx, dy) => {
                setNodes((current) =>
                  current.map((item) =>
                    item.id === node.id ? { ...item, x: item.x + dx, y: item.y + dy } : item,
                  ),
                )
              }}
              onMoveEnd={() => undefined}
              onCapture={() => {
                setHideBlockChrome(true)
                setPublishNode(node)
              }}
              onCode={() => setCodeNode(node)}
              onDelete={() => {
                void handleDelete(node)
              }}
              onHtmlResizeStart={(edge, event) => {
                if (node.kind !== 'htmlSnippet') {
                  return
                }
                event.stopPropagation()
                const size = nodeSize(node)
                resizeRef.current = {
                  edge,
                  id: node.id,
                  start: { x: node.x, y: node.y, width: size.width, height: size.height },
                  pointerX: event.clientX,
                  pointerY: event.clientY,
                }
                setSelectedId(node.id)
                viewportRef.current?.setPointerCapture(event.pointerId)
              }}
              onHtmlContentHeight={(height) => onHtmlContentHeight(node.id, height)}
            />
          ))}
          {skeleton ? <CanvasGenerationSkeleton rect={skeleton} /> : null}
          {frameDraft ? (
            <div
              className="pointer-events-none absolute border border-dashed border-brandcolor-700 bg-brandcolor-700/5"
              style={{
                left: frameDraft.x,
                top: frameDraft.y,
                width: frameDraft.width,
                height: frameDraft.height,
              }}
            />
          ) : null}
        </div>
        {tool === 'frame' ? (
          <div className="absolute inset-0 z-10 cursor-crosshair" />
        ) : null}
      </div>

      <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-col gap-1">
        <div className="pointer-events-auto flex flex-col overflow-hidden rounded-lg border border-brandcolor-200 bg-white shadow">
          <ToolButton
            active={tool === 'select'}
            label="Select"
            onClick={() => setTool('select')}
          >
            <RiCursorLine className="size-4" />
          </ToolButton>
          <ToolButton
            active={tool === 'frame'}
            label="Frame"
            onClick={() => setTool('frame')}
          >
            <RiCheckboxBlankLine className="size-4" />
          </ToolButton>
          <ToolButton label="Focus prompt" onClick={requestPromptFocus}>
            <RiChat1Line className="size-4" />
          </ToolButton>
        </div>
        <div className="pointer-events-auto mt-1 flex flex-col overflow-hidden rounded-lg border border-brandcolor-200 bg-white shadow">
          <ToolButton label="Zoom in" onClick={() => zoomFromCenter(SCALE_STEP)}>
            <RiAddLine className="size-4" />
          </ToolButton>
          <ToolButton label="Zoom out" onClick={() => zoomFromCenter(1 / SCALE_STEP)}>
            <RiSubtractLine className="size-4" />
          </ToolButton>
          <ToolButton label="Fit view" onClick={fitAll}>
            <RiAspectRatioLine className="size-4" />
          </ToolButton>
          <ToolButton
            label="Focus selection"
            onClick={() => selected && focusBlocks([selected.id])}
          >
            <RiFocus3Line className="size-4" />
          </ToolButton>
        </div>
      </div>

      {selected ? (
        <aside className="absolute right-0 top-0 z-20 flex h-full w-56 flex-col border-l border-brandcolor-200 bg-white p-3 text-canvas-ui">
          <p className="text-canvas-xs uppercase text-brandcolor-500">Inspector</p>
          <p className="mt-1 font-medium">{nodeToolbarLabel(selected)}</p>
          <p className="text-brandcolor-500">
            {String(nodes.length)} blocks · {selected.kind}
          </p>
          <p className="mt-2">
            {isPublished(selected) ? (
              <span className="rounded bg-brandcolor-warning-soft px-1 text-brandcolor-warning">
                Published
              </span>
            ) : (
              <span className="rounded bg-brandcolor-100 px-1 text-brandcolor-500">
                Not published
              </span>
            )}
          </p>
          {selected.kind === 'htmlSnippet' ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label>
                W
                <input
                  className="mt-0.5 w-full rounded border border-brandcolor-200 px-1 py-0.5"
                  value={widthDraft}
                  onChange={(event) => setWidthDraft(event.target.value)}
                  onBlur={commitLayoutSize}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      commitLayoutSize()
                    }
                  }}
                />
              </label>
              <label>
                H
                <input
                  className="mt-0.5 w-full rounded border border-brandcolor-200 px-1 py-0.5"
                  value={heightDraft}
                  onChange={(event) => setHeightDraft(event.target.value)}
                  onBlur={commitLayoutSize}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      commitLayoutSize()
                    }
                  }}
                />
              </label>
            </div>
          ) : null}
          <div className="mt-3 flex flex-col gap-1">
            <button
              type="button"
              className="rounded border border-brandcolor-200 px-2 py-1 text-left"
              onClick={() => {
                setHideBlockChrome(true)
                setPublishNode(selected)
              }}
            >
              Capture
            </button>
            <button
              type="button"
              className="rounded border border-brandcolor-200 px-2 py-1 text-left"
              onClick={() => setCodeNode(selected)}
            >
              Code
            </button>
            <button
              type="button"
              className="rounded border border-brandcolor-200 px-2 py-1 text-left text-red-700"
              onClick={() => void handleDelete(selected)}
            >
              Delete
            </button>
          </div>
        </aside>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center px-3">
        <ComponentsCanvasPromptPanel nodes={nodes} />
      </div>

      {successBanner ? (
        <div className="absolute left-1/2 top-3 z-30 flex -translate-x-1/2 items-center gap-2 rounded-md border border-brandcolor-200 bg-white px-3 py-1.5 text-[13px] shadow">
          <span>{successBanner}</span>
          <button type="button" className="text-brandcolor-500" onClick={() => setSuccessBanner(null)}>
            Dismiss
          </button>
        </div>
      ) : null}

      <CanvasPublishModal
        open={publishNode !== null}
        defaultName={publishNode ? nodeToolbarLabel(publishNode) : 'Component'}
        previewHtml={publishNode ? buildSourceHtmlForCanvasNode(publishNode) : ''}
        busy={publishBusy}
        error={publishError}
        onClose={() => {
          if (publishBusy) {
            return
          }
          setPublishNode(null)
          setPublishError(null)
          setHideBlockChrome(false)
        }}
        onPublish={(values) => {
          void handlePublish(values)
        }}
      />
      <CanvasCodeModal
        open={codeNode !== null}
        sourceHtml={codeNode ? buildSourceHtmlForCanvasNode(codeNode) : ''}
        blueprint={codeNode ? blueprintForNode(codeNode) : {}}
        onClose={() => setCodeNode(null)}
      />
    </div>
  )
}

function ToolButton({
  children,
  label,
  onClick,
  active = false,
}: {
  children: ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex size-9 items-center justify-center ${
        active ? 'bg-brandcolor-100 text-brandcolor-900' : 'text-brandcolor-700'
      }`}
    >
      {children}
    </button>
  )
}
