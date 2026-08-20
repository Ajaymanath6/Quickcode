import { COLOR_GROUPS } from '@/lib/theme/defaults'
import type { BrandColorKey } from '@/lib/theme/defaults'
import { validateColor } from '@/lib/theme/theme-storage'
import { useThemeEngine } from '@/context/ThemeEngineContext'

export default function ThemeColorsPanel() {
  const theme = useThemeEngine()

  const update = (key: BrandColorKey, value: string) => {
    const next = { ...theme.draft, colors: { ...theme.draft.colors, [key]: value } }
    const error = validateColor(value)
    const errors = { ...theme.errors }
    const errorKey = `color:${key}`
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
      <div
        className="flex overflow-hidden rounded-xl border border-brandcolor-200"
        aria-hidden
      >
        {COLOR_GROUPS.flatMap((group) => group.keys).map((key) => (
          <div key={key} className="h-10 flex-1" style={{ background: theme.draft.colors[key] }} />
        ))}
      </div>
      {COLOR_GROUPS.map((group) => (
        <section key={group.title} className="rounded-xl border border-brandcolor-200 bg-white p-4">
          <h3 className="mb-3 text-[13px] font-semibold text-brandcolor-900">{group.title}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.keys.map((key) => (
              <label key={key} className="block text-[13px] text-brandcolor-700">
                <span className="flex items-center gap-2">
                  <span
                    className="size-5 rounded border border-brandcolor-200"
                    style={{ background: theme.draft.colors[key] }}
                  />
                  brandcolor-{key}
                </span>
                <input
                  className="mt-1 w-full rounded-md border border-brandcolor-200 px-2 py-1 font-mono text-[13px]"
                  value={theme.draft.colors[key]}
                  onChange={(event) => update(key, event.target.value)}
                />
                {theme.errors[`color:${key}`] ? (
                  <span className="text-[11px] text-brandcolor-warning">
                    {theme.errors[`color:${key}`]}
                  </span>
                ) : null}
              </label>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
