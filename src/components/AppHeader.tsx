import { Link, useLocation } from 'react-router-dom'
import GoogleDuotoneIcon from '@/components/GoogleDuotoneIcon'

const NAV_ITEM_CLASS =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-4 py-3 text-base text-brandcolor-strokestrong transition-colors hover:bg-brandcolor-fill'

const PLACEHOLDER_NAV = [
  { label: 'Organisation', icon: 'business' },
  { label: 'Billing', icon: 'payments' },
] as const

export type AppHeaderBreadcrumb = {
  caseId: string
  caseName: string
  sectionLabel: string
}

type AppHeaderProps = {
  initials?: string
  avatarClassName?: string
  breadcrumbs?: AppHeaderBreadcrumb
}

export default function AppHeader({
  initials = 'GF',
  avatarClassName = 'bg-[#DC143C]',
  breadcrumbs,
}: AppHeaderProps) {
  const { pathname } = useLocation()
  const homeActive = pathname === '/case'
  const isCaseDetail = pathname.startsWith('/case-detail/')

  return (
    <header className="z-50 shrink-0 bg-brandcolor-white font-lato shadow-app-header">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link to="/case" className="inline-flex shrink-0 items-center" aria-label="GoldFynch home">
            <img
              src="/landing/goldfynch-bird.png"
              alt="GoldFynch"
              className="h-9 w-auto object-contain"
              width={36}
              height={36}
            />
          </Link>

          {isCaseDetail && breadcrumbs ? (
            <nav className="min-w-0 overflow-hidden" aria-label="Breadcrumb">
              <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <li className="min-w-0 truncate">
                  <Link
                    to={`/case-detail/${breadcrumbs.caseId}/start-here`}
                    className="font-catamaran text-brandcolor-textweak transition-colors hover:text-brandcolor-secondary"
                    title={breadcrumbs.caseName}
                  >
                    {breadcrumbs.caseName}
                  </Link>
                </li>
                <li className="shrink-0 text-brandcolor-strokeweak" aria-hidden>
                  /
                </li>
                <li
                  className="min-w-0 truncate rounded-md bg-brandcolor-fill px-2 py-0.5 font-semibold text-brandcolor-textstrong"
                  aria-current="page"
                  title={breadcrumbs.sectionLabel}
                >
                  {breadcrumbs.sectionLabel}
                </li>
              </ol>
            </nav>
          ) : null}
        </div>

        {!isCaseDetail ? (
          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex"
            aria-label="App"
          >
            <Link
              to="/case"
              className={`${NAV_ITEM_CLASS} ${
                homeActive ? 'font-medium !text-brandcolor-textstrong' : ''
              }`}
              aria-current={homeActive ? 'page' : undefined}
            >
              <GoogleDuotoneIcon
                name="home"
                className={`text-[20px] ${
                  homeActive
                    ? '!text-brandcolor-textstrong'
                    : '!text-brandcolor-strokestrong'
                }`}
              />
              Home
            </Link>
            {PLACEHOLDER_NAV.map(({ label, icon }) => (
              <button key={label} type="button" className={NAV_ITEM_CLASS}>
                <GoogleDuotoneIcon name={icon} className="text-[20px] !text-brandcolor-strokestrong" />
                {label}
              </button>
            ))}
          </nav>
        ) : null}

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md text-brandcolor-textweak transition-colors hover:bg-brandcolor-fill hover:text-brandcolor-textstrong"
            aria-label="Notifications"
          >
            <GoogleDuotoneIcon name="notifications" className="text-[22px]" />
          </button>
          <div
            className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold text-brandcolor-white ${avatarClassName}`}
            aria-label={`User ${initials}`}
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
