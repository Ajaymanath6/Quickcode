import { RiCodeSSlashLine } from '@remixicon/react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="shrink-0 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
        <Link to="/admin/canvas" className="flex items-center gap-2 font-semibold">
          <RiCodeSSlashLine className="size-6 text-slate-800" aria-hidden />
          QuickCode
        </Link>
        <nav className="ml-auto">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
            Landing
          </Link>
        </nav>
      </div>
    </header>
  )
}
