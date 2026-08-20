import { TYPOGRAPHY_KEYS } from '@/lib/theme/defaults'
import type { TypographyTokenKey } from '@/lib/theme/defaults'
import { validateLength } from '@/lib/theme/theme-storage'
import { useThemeEngine } from '@/context/ThemeEngineContext'

export default function ThemeTypographyPanel() {
  const theme = useThemeEngine()

  const update = (key: TypographyTokenKey, value: string) => {
    const next = {
      ...theme.draft,
      typography: { ...theme.draft.typography, [key]: value },
    }
    const error = validateLength(value)
    const errors = { ...theme.errors }
    const errorKey = `type:${key}`
    if (error) {
      errors[errorKey] = error
    } else {
      delete errors[errorKey]
    }
    theme.setErrors(errors)
    theme.setDraft(next)
  }

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-brandcolor-200 bg-white p-4">
        <p
          className="text-brandcolor-900"
          style={{
            fontSize: theme.draft.typography['font-size-lg'],
            lineHeight: theme.draft.typography['line-height-lg'],
          }}
        >
          Heading preview
        </p>
        <p
          className="mt-2 text-brandcolor-700"
          style={{
            fontSize: theme.draft.typography['font-size-sm'],
            lineHeight: theme.draft.typography['line-height-sm'],
          }}
        >
          Body preview using the current size and line-height tokens.
        </p>
      </section>
      <section className="rounded-xl border border-brandcolor-200 bg-white p-4">
        <h3 className="mb-3 text-[13px] font-semibold">Size and line-height</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {TYPOGRAPHY_KEYS.map((key) => (
            <label key={key} className="block text-[13px] text-brandcolor-700">
              {key}
              <input
                className="mt-1 w-full rounded-md border border-brandcolor-200 px-2 py-1 font-mono text-[13px]"
                value={theme.draft.typography[key]}
                onChange={(event) => update(key, event.target.value)}
              />
              {theme.errors[`type:${key}`] ? (
                <span className="text-[11px] text-brandcolor-warning">
                  {theme.errors[`type:${key}`]}
                </span>
              ) : null}
            </label>
          ))}
        </div>
      </section>
    </div>
  )
}
