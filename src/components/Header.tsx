import { Link, useLocation } from 'react-router-dom'
import BrandLogo from '@/components/BrandLogo'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Support', href: '#support' },
  { label: 'Resources', href: '#resources' },
  { label: 'Contact Us', href: '#contact' },
] as const

export default function Header() {
  const { pathname } = useLocation()
  const loginTo = pathname === '/landing4' ? '/loading' : '/catalog/home'

  return (
    <header className="shrink-0 border-b border-brandcolor-strokeweak bg-brandcolor-white font-lato">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between py-3">
        <BrandLogo imgClassName="h-9 w-auto max-w-[200px] object-contain object-left" />

        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-5 md:flex"
          aria-label="Primary"
        >
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href="#signup"
            className="rounded-[0.3rem] border border-brandcolor-primary bg-brandcolor-primary px-3 py-1.5 text-sm font-medium text-brandcolor-textstrong transition-colors hover:bg-brandcolor-primaryhover"
          >
            Get started
          </a>
          <Link
            to={loginTo}
            className="rounded-[0.3rem] border border-brandcolor-strokestrong px-3 py-1.5 text-sm font-medium text-brandcolor-textstrong transition-colors hover:bg-brandcolor-neutralhover"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}
