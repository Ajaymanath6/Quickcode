import { RiCodeSSlashLine } from '@remixicon/react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="shrink-0 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
        <Link to="/catalog/home" aria-label="Open catalog" className="text-slate-800">
          <RiCodeSSlashLine className="size-6" />
        </Link>
        <Link to="/" className="font-semibold text-slate-900">
          QuickCode
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link to="/catalog/home" className="text-sm text-slate-600 hover:text-slate-900">
            Catalog
          </Link>
          <Link to="/admin/canvas" className="text-sm text-slate-600 hover:text-slate-900">
            Canvas
          </Link>
        </nav>
      </div>
    </header>
  )
}
