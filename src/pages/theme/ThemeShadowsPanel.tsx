import { SHADOW_KEYS } from '@/lib/theme/defaults'
import type { ShadowTokenKey } from '@/lib/theme/defaults'
import { validateShadow } from '@/lib/theme/theme-storage'
import { useThemeEngine } from '@/context/ThemeEngineContext'

export default function ThemeShadowsPanel() {
  const theme = useThemeEngine()

  const update = (key: ShadowTokenKey, value: string) => {
    const next = { ...theme.draft, shadows: { ...theme.draft.shadows, [key]: value } }
    const error = validateShadow(value)
    const errors = { ...theme.errors }
    const errorKey = `shadow:${key}`
    if (error) {
      errors[errorKey] = error
    } else {
      delete errors[errorKey]
    }
    theme.setErrors(errors)
    theme.setDraft(next)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {SHADOW_KEYS.map((key) => (
        <section key={key} className="rounded-xl border border-brandcolor-strokeweak bg-white p-4">
          <div
            className="mb-3 h-20 rounded-lg border border-brandcolor-strokeweak bg-white"
            style={{ boxShadow: theme.draft.shadows[key] }}
          />
          <label className="block text-[13px] text-brandcolor-textstrong">
            {key}
            <textarea
              rows={3}
              className="mt-1 w-full rounded-md border border-brandcolor-strokeweak px-2 py-1 font-mono text-[12px]"
              value={theme.draft.shadows[key]}
              onChange={(event) => update(key, event.target.value)}
            />
          </label>
          {theme.errors[`shadow:${key}`] ? (
            <p className="mt-1 text-[11px] text-brandcolor-banner-warning-button">
              {theme.errors[`shadow:${key}`]}
            </p>
          ) : null}
        </section>
      ))}
    </div>
  )
}
