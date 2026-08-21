export const COLOR_KEYS = [
  'primary',
  'primaryhover',
  'secondary',
  'secondaryfill',
  'secondaryhover',
  'neutralhover',
  'textstrong',
  'textweak',
  'strokestrong',
  'strokeweak',
  'strokemild',
  'strokelight',
  'fill',
  'white',
  'sidebarhover',
  'divider',
  'banner-info-bg',
  'banner-warning-bg',
  'banner-warning-button',
  'results-bg',
  'archived-bg',
  'archived-border',
  'archived-badge',
  'destructive',
  'table-header',
  'badge-success-bg',
  'badge-success-text',
  'badge-attorney-bg',
  'badge-attorney-text',
  'badge-amber-bg',
  'badge-amber-text',
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
  primary: '#F5C251',
  primaryhover: '#F3B42A',
  secondary: '#2B6CB0',
  secondaryfill: '#EEF2F7',
  secondaryhover: '#23588F',
  neutralhover: '#EFEFEF',
  textstrong: '#333333',
  textweak: '#696969',
  strokestrong: '#696969',
  strokeweak: '#E8E8E8',
  strokemild: '#858585',
  strokelight: '#F6F6F6',
  fill: '#FAFAFA',
  white: '#FFFFFF',
  sidebarhover: '#2E3C48',
  divider: '#E8E8E8',
  'banner-info-bg': '#FFE4D6',
  'banner-warning-bg': '#FFEBE1',
  'banner-warning-button': '#F5C251',
  'results-bg': '#F8F9FB',
  'archived-bg': '#FBF8E7',
  'archived-border': '#A5A5A5',
  'archived-badge': '#E8E8E8',
  destructive: '#C20205',
  'table-header': '#DDDDDD',
  'badge-success-bg': '#E2F3E0',
  'badge-success-text': '#028831',
  'badge-attorney-bg': '#F2EBFF',
  'badge-attorney-text': '#6238AA',
  'badge-amber-bg': '#FFF7DB',
  'badge-amber-text': '#A47800',
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
  { title: 'Brand', keys: ['primary', 'primaryhover', 'secondary', 'secondaryfill', 'secondaryhover'] },
  { title: 'Text', keys: ['textstrong', 'textweak'] },
  { title: 'Stroke / fill', keys: ['strokestrong', 'strokeweak', 'strokemild', 'strokelight', 'fill', 'white', 'divider', 'neutralhover'] },
  {
    title: 'Surfaces',
    keys: [
      'sidebarhover',
      'banner-info-bg',
      'banner-warning-bg',
      'banner-warning-button',
      'results-bg',
      'table-header',
    ],
  },
  {
    title: 'Status',
    keys: [
      'destructive',
      'archived-bg',
      'archived-border',
      'archived-badge',
      'badge-success-bg',
      'badge-success-text',
      'badge-attorney-bg',
      'badge-attorney-text',
      'badge-amber-bg',
      'badge-amber-text',
    ],
  },
]
