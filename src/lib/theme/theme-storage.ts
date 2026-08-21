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
    return jsonToOverrides(JSON.parse(raw) as ThemeOverrides)
  } catch {
    return {}
  }
}

function jsonToOverrides(raw: ThemeOverrides): ThemeOverrides {
  const colors: Partial<ColorMap> = {}
  if (raw.colors) {
    for (const key of COLOR_KEYS) {
      const value = raw.colors[key]
      if (typeof value === 'string') {
        colors[key] = value
      }
    }
  }
  return {
    colors,
    typography: raw.typography,
    shadows: raw.shadows,
    spacing: raw.spacing,
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

export function hexToRgbChannels(hex: string): string | null {
  const trimmed = hex.trim()
  const match = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(trimmed)
  if (!match) {
    return null
  }
  let value = match[1]
  if (value.length === 3) {
    value = value
      .split('')
      .map((ch) => ch + ch)
      .join('')
  }
  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  return `${r} ${g} ${b}`
}

export function applyThemeToDocument(maps: ThemeMaps): void {
  const root = document.documentElement
  for (const key of COLOR_KEYS) {
    const channels = hexToRgbChannels(maps.colors[key])
    if (channels) {
      root.style.setProperty(`--color-brandcolor-${key}`, channels)
    }
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
  return HEX.test(value.trim()) ? null : 'Use a 3 or 6 digit hex color, e.g. #F84416'
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

/** Live palette snapshot for LLM / canvas AI (semantic keys → hex). */
export function themeSnapshotFromMaps(maps: ThemeMaps): Record<string, string> {
  const snapshot: Record<string, string> = {}
  for (const key of COLOR_KEYS) {
    snapshot[key] = maps.colors[key]
  }
  return snapshot
}
