import { SPACING_KEYS } from '@/lib/theme/defaults'
import type { SpacingTokenKey } from '@/lib/theme/defaults'
import { validateLength } from '@/lib/theme/theme-storage'
import { useThemeEngine } from '@/context/ThemeEngineContext'

const HELP: Record<SpacingTokenKey, string> = {
  'space-1': 'Tight inset, icon padding',
  'space-2': 'Compact control padding',
  'space-3': 'Default card padding',
  'space-4': 'Section gap',
  'space-6': 'Page gutter',
  'space-8': 'Hero / stack spacing',
}

export default function ThemeSpacingPanel() {
  const theme = useThemeEngine()

  const update = (key: SpacingTokenKey, value: string) => {
    const next = { ...theme.draft, spacing: { ...theme.draft.spacing, [key]: value } }
    const error = validateLength(value)
    const errors = { ...theme.errors }
    const errorKey = `space:${key}`
    if (error) {
      errors[errorKey] = error
    } else {
      delete errors[errorKey]
    }
    theme.setErrors(errors)
    theme.setDraft(next)
  }

  return (
    <div className="space-y-3">
      {SPACING_KEYS.map((key) => (
        <section
          key={key}
          className="flex items-center gap-4 rounded-xl border border-brandcolor-200 bg-white p-4"
        >
          <div
            className="shrink-0 rounded bg-brandcolor-700"
            style={{ width: theme.draft.spacing[key], height: '16px' }}
          />
          <label className="min-w-0 flex-1 text-[13px] text-brandcolor-700">
            {key}
            <span className="ml-2 text-brandcolor-500">{HELP[key]}</span>
            <input
              className="mt-1 w-full rounded-md border border-brandcolor-200 px-2 py-1 font-mono text-[13px]"
              value={theme.draft.spacing[key]}
              onChange={(event) => update(key, event.target.value)}
            />
            {theme.errors[`space:${key}`] ? (
              <span className="text-[11px] text-brandcolor-warning">
                {theme.errors[`space:${key}`]}
              </span>
            ) : null}
          </label>
        </section>
      ))}
    </div>
  )
}
