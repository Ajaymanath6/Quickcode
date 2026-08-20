import {
  COLOR_KEYS,
  DEFAULT_COLORS,
  DEFAULT_SHADOWS,
  DEFAULT_SPACING,
  DEFAULT_TYPOGRAPHY,
  SHADOW_KEYS,
  SPACING_KEYS,
  TYPOGRAPHY_KEYS,
} from '@/lib/theme/defaults'
import type {
  BrandColorKey,
  ColorMap,
  ShadowMap,
  ShadowTokenKey,
  SpacingMap,
  SpacingTokenKey,
  TypographyMap,
  TypographyTokenKey,
} from '@/lib/theme/defaults'

const STORAGE_KEY = 'quickcode.theme.overrides'

export type ThemeOverrides = {
  colors?: Partial<ColorMap>
  typography?: Partial<TypographyMap>
  shadows?: Partial<ShadowMap>
  spacing?: Partial<SpacingMap>
}

export type ThemeMaps = {
  colors: ColorMap
  typography: TypographyMap
  shadows: ShadowMap
  spacing: SpacingMap
}

export function loadOverrides(): ThemeOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {}
    }
    return JSON.parse(raw) as ThemeOverrides
  } catch {
    return {}
  }
}

export function saveOverrides(overrides: ThemeOverrides): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export function clearOverrides(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function mergeTheme(overrides: ThemeOverrides): ThemeMaps {
  return {
    colors: { ...DEFAULT_COLORS, ...overrides.colors },
    typography: { ...DEFAULT_TYPOGRAPHY, ...overrides.typography },
    shadows: { ...DEFAULT_SHADOWS, ...overrides.shadows },
    spacing: { ...DEFAULT_SPACING, ...overrides.spacing },
  }
}

export function applyThemeToDocument(maps: ThemeMaps): void {
  const root = document.documentElement
  for (const key of COLOR_KEYS) {
    const cssKey = key === 'warning' || key === 'warning-soft' ? key : key
    root.style.setProperty(`--brandcolor-${cssKey}`, maps.colors[key])
  }
  for (const key of TYPOGRAPHY_KEYS) {
    root.style.setProperty(`--${key}`, maps.typography[key])
  }
  for (const key of SHADOW_KEYS) {
    root.style.setProperty(`--${key}`, maps.shadows[key])
  }
  for (const key of SPACING_KEYS) {
    root.style.setProperty(`--${key}`, maps.spacing[key])
  }
}

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
const LENGTH = /^\d+(\.\d+)?(px|rem|em)$/

export function validateColor(value: string): string | null {
  return HEX.test(value.trim()) ? null : 'Use a 3 or 6 digit hex color, e.g. #243140'
}

export function validateLength(value: string): string | null {
  return LENGTH.test(value.trim()) ? null : 'Use a CSS length, e.g. 16px or 1rem'
}

export function validateShadow(value: string): string | null {
  return value.trim().length > 3 ? null : 'Enter a CSS box-shadow value'
}

export function overridesFromMaps(maps: ThemeMaps): ThemeOverrides {
  const colors: Partial<ColorMap> = {}
  const typography: Partial<TypographyMap> = {}
  const shadows: Partial<ShadowMap> = {}
  const spacing: Partial<SpacingMap> = {}
  for (const key of COLOR_KEYS) {
    if (maps.colors[key] !== DEFAULT_COLORS[key]) {
      colors[key as BrandColorKey] = maps.colors[key]
    }
  }
  for (const key of TYPOGRAPHY_KEYS) {
    if (maps.typography[key] !== DEFAULT_TYPOGRAPHY[key]) {
      typography[key as TypographyTokenKey] = maps.typography[key]
    }
  }
  for (const key of SHADOW_KEYS) {
    if (maps.shadows[key] !== DEFAULT_SHADOWS[key]) {
      shadows[key as ShadowTokenKey] = maps.shadows[key]
    }
  }
  for (const key of SPACING_KEYS) {
    if (maps.spacing[key] !== DEFAULT_SPACING[key]) {
      spacing[key as SpacingTokenKey] = maps.spacing[key]
    }
  }
  return { colors, typography, shadows, spacing }
}
