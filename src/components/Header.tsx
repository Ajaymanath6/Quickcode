import { Link } from 'react-router-dom'
import BrandLogo from '@/components/BrandLogo'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Support', href: '#support' },
  { label: 'Resources', href: '#resources' },
  { label: 'Contact Us', href: '#contact' },
] as const

export default function Header() {
  return (
    <header className="shrink-0 border-b border-brandcolor-strokeweak bg-brandcolor-white font-lato">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <BrandLogo imgClassName="h-9 w-auto max-w-[200px] object-contain object-left" />

        <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-brandcolor-textweak transition-colors hover:text-brandcolor-textstrong"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href="#signup"
            className="rounded-none border border-brandcolor-primary bg-brandcolor-primary px-3 py-1.5 text-sm font-medium text-brandcolor-textstrong transition-colors hover:bg-brandcolor-primaryhover"
          >
            Get started
          </a>
          <Link
            to="/catalog/home"
            className="rounded-none border border-brandcolor-strokestrong px-3 py-1.5 text-sm font-medium text-brandcolor-textstrong transition-colors hover:bg-brandcolor-neutralhover"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}
