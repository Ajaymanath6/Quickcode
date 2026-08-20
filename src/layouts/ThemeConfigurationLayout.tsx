import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useThemeEngine } from '@/context/ThemeEngineContext'

function titleFromPath(pathname: string): string {
  if (pathname.endsWith('/typography')) {
    return 'Typography'
  }
  if (pathname.endsWith('/shadows')) {
    return 'Shadows'
  }
  if (pathname.endsWith('/spacing')) {
    return 'Spacing'
  }
  return 'Colors'
}

export default function ThemeConfigurationLayout() {
  const location = useLocation()
  const theme = useThemeEngine()
  const [notice, setNotice] = useState<string | null>(null)
  const title = titleFromPath(location.pathname)
  const hasErrors = Object.keys(theme.errors).length > 0

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-auto text-base font-semibold text-brandcolor-900">{title}</h2>
        <button
          type="button"
          className="rounded-md border border-brandcolor-200 bg-white px-3 py-1.5 text-[13px]"
          onClick={() => {
            theme.resetAll()
            setNotice('Defaults restored.')
          }}
        >
          Reset all
        </button>
        <button
          type="button"
          className="rounded-md border border-brandcolor-200 bg-white px-3 py-1.5 text-[13px]"
          onClick={() => theme.exportJson()}
        >
          Export JSON
        </button>
        <button
          type="button"
          className="rounded-md bg-brandcolor-700 px-3 py-1.5 text-[13px] text-white disabled:opacity-40"
          disabled={!theme.dirty || hasErrors}
          onClick={() => {
            theme.save()
            setNotice('Theme saved in this browser.')
          }}
        >
          Save
        </button>
        <button
          type="button"
          className="rounded-md border border-brandcolor-200 bg-white px-3 py-1.5 text-[13px]"
          onClick={() => setNotice(theme.saveToProjectFiles())}
        >
          Save to project files
        </button>
      </div>
      {notice ? <p className="text-[13px] text-brandcolor-500">{notice}</p> : null}
      <Outlet />
    </div>
  )
}
