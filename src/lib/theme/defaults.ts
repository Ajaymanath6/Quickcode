export const COLOR_KEYS = [
  '50',
  '100',
  '200',
  '500',
  '700',
  '900',
  'warning',
  'warning-soft',
] as const

export type BrandColorKey = (typeof COLOR_KEYS)[number]

export const TYPOGRAPHY_KEYS = [
  'font-size-xs',
  'font-size-sm',
  'font-size-base',
  'font-size-lg',
  'line-height-xs',
  'line-height-sm',
  'line-height-base',
  'line-height-lg',
] as const

export type TypographyTokenKey = (typeof TYPOGRAPHY_KEYS)[number]

export const SHADOW_KEYS = ['shadow-sm', 'shadow-md', 'shadow-lg'] as const
export type ShadowTokenKey = (typeof SHADOW_KEYS)[number]

export const SPACING_KEYS = ['space-1', 'space-2', 'space-3', 'space-4', 'space-6', 'space-8'] as const
export type SpacingTokenKey = (typeof SPACING_KEYS)[number]

export type ColorMap = Record<BrandColorKey, string>
export type TypographyMap = Record<TypographyTokenKey, string>
export type ShadowMap = Record<ShadowTokenKey, string>
export type SpacingMap = Record<SpacingTokenKey, string>

export const DEFAULT_COLORS: ColorMap = {
  '50': '#f4f6f8',
  '100': '#e8ecf1',
  '200': '#d0d8e2',
  '500': '#3d4f63',
  '700': '#243140',
  '900': '#121820',
  warning: '#c47b16',
  'warning-soft': '#f8edd9',
}

export const DEFAULT_TYPOGRAPHY: TypographyMap = {
  'font-size-xs': '12px',
  'font-size-sm': '14px',
  'font-size-base': '16px',
  'font-size-lg': '20px',
  'line-height-xs': '16px',
  'line-height-sm': '20px',
  'line-height-base': '24px',
  'line-height-lg': '28px',
}

export const DEFAULT_SHADOWS: ShadowMap = {
  'shadow-sm': '0 1px 2px rgb(18 24 32 / 0.06)',
  'shadow-md': '0 4px 12px rgb(18 24 32 / 0.08)',
  'shadow-lg': '0 12px 24px rgb(18 24 32 / 0.12)',
}

export const DEFAULT_SPACING: SpacingMap = {
  'space-1': '4px',
  'space-2': '8px',
  'space-3': '12px',
  'space-4': '16px',
  'space-6': '24px',
  'space-8': '32px',
}

export const COLOR_GROUPS: { title: string; keys: BrandColorKey[] }[] = [
  { title: 'Fill', keys: ['50', '100'] },
  { title: 'Stroke', keys: ['200'] },
  { title: 'Primary / text', keys: ['500', '700', '900'] },
  { title: 'Semantic', keys: ['warning', 'warning-soft'] },
]
