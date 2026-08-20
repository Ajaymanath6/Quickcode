export const WORLD_W = 3200
export const WORLD_H = 2400
export const GRID_SIZE = 24
export const SCALE_MIN = 0.2
export const SCALE_MAX = 2.5
export const SCALE_STEP = 1.12

export type CanvasTool = 'select' | 'frame'

export type NavSection = {
  title: string
  items: { label: string; iconKey?: string }[]
}

type NodeBase = {
  id: string
  x: number
  y: number
}

export type CardNode = NodeBase & {
  kind: 'card'
  title: string
  subtitle: string
  body: string
}

export type PrimaryButtonNode = NodeBase & {
  kind: 'primaryButton'
  label: string
}

export type SecondaryButtonNode = NodeBase & {
  kind: 'secondaryButton'
  label: string
}

export type NeutralButtonNode = NodeBase & {
  kind: 'neutralButton'
  label: string
}

export type ConfirmPasswordInputNode = NodeBase & {
  kind: 'confirmPasswordInput'
  label: string
}

export type TextInputFieldNode = NodeBase & {
  kind: 'textInputField'
  label: string
}

export type ProductSidebarNode = NodeBase & {
  kind: 'productSidebar'
  title: string
  trailingIconKey: string
  searchPlaceholder: string
  neutralButtonLabel: string
  navSections: NavSection[]
}

export type HtmlSnippetNode = NodeBase & {
  kind: 'htmlSnippet'
  label: string
  html: string
  shellHeightPx?: number
  widthPx?: number
  userResized?: boolean
}

export type CanvasNode =
  | CardNode
  | PrimaryButtonNode
  | SecondaryButtonNode
  | NeutralButtonNode
  | ConfirmPasswordInputNode
  | TextInputFieldNode
  | ProductSidebarNode
  | HtmlSnippetNode

export type CanvasNodeKind = CanvasNode['kind']

export type CatalogKind = 'component' | 'layout'

export type CatalogEntry = {
  componentId: string
  id?: string
  label: string
  name?: string
  sourceHtml: string
  description?: string
  sealed?: boolean
  kind: CatalogKind | CanvasNodeKind
  blueprint: Record<string, unknown>
  hasBlueprint?: boolean
  blueprintPath?: string
  thumbnailPath?: string
  publishedAt?: string
  isLayout?: boolean
}

export type ViewportState = {
  tx: number
  ty: number
  scale: number
}

export type Size = { width: number; height: number }

export type Rect = { x: number; y: number; width: number; height: number }
