import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  DEFAULT_COLORS,
  DEFAULT_SHADOWS,
  DEFAULT_SPACING,
  DEFAULT_TYPOGRAPHY,
} from '@/lib/theme/defaults'
import type { ThemeMaps } from '@/lib/theme/theme-storage'
import {
  applyThemeToDocument,
  clearOverrides,
  loadOverrides,
  mergeTheme,
  overridesFromMaps,
  saveOverrides,
} from '@/lib/theme/theme-storage'

type ThemeEngineValue = {
  draft: ThemeMaps
  setDraft: (maps: ThemeMaps) => void
  dirty: boolean
  errors: Record<string, string>
  setErrors: (errors: Record<string, string>) => void
  save: () => void
  resetAll: () => void
  exportJson: () => void
  saveToProjectFiles: () => string
}

const ThemeEngineContext = createContext<ThemeEngineValue | null>(null)

function mapsEqual(a: ThemeMaps, b: ThemeMaps): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function ThemeEngineProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<ThemeMaps>(() => {
    const maps = mergeTheme(loadOverrides())
    applyThemeToDocument(maps)
    return maps
  })
  const [saved, setSaved] = useState<ThemeMaps>(() => mergeTheme(loadOverrides()))
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setDraft = useCallback((maps: ThemeMaps) => {
    setDraftState(maps)
    applyThemeToDocument(maps)
  }, [])

  const save = useCallback(() => {
    if (Object.keys(errors).length > 0) {
      return
    }
    saveOverrides(overridesFromMaps(draft))
    setSaved(draft)
  }, [draft, errors])

  const resetAll = useCallback(() => {
    clearOverrides()
    const maps: ThemeMaps = {
      colors: { ...DEFAULT_COLORS },
      typography: { ...DEFAULT_TYPOGRAPHY },
      shadows: { ...DEFAULT_SHADOWS },
      spacing: { ...DEFAULT_SPACING },
    }
    setDraftState(maps)
    setSaved(maps)
    setErrors({})
    applyThemeToDocument(maps)
  }, [])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'theme-tokens.json'
    link.click()
    URL.revokeObjectURL(url)
  }, [draft])

  const saveToProjectFiles = useCallback(() => {
    return 'No publish helper is running. Theme is saved in the browser only. Start npm run dev for local preview.'
  }, [])

  const dirty = !mapsEqual(draft, saved)

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      dirty,
      errors,
      setErrors,
      save,
      resetAll,
      exportJson,
      saveToProjectFiles,
    }),
    [dirty, draft, errors, exportJson, resetAll, save, saveToProjectFiles, setDraft],
  )

  return <ThemeEngineContext.Provider value={value}>{children}</ThemeEngineContext.Provider>
}

export function useThemeEngine(): ThemeEngineValue {
  const value = useContext(ThemeEngineContext)
  if (!value) {
    throw new Error('useThemeEngine must be used within ThemeEngineProvider')
  }
  return value
}
