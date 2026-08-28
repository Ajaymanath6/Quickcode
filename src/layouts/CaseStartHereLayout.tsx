import type { CaseRow } from '@/data/cases'
import GoogleDuotoneIcon from '@/components/GoogleDuotoneIcon'

const RECOMMENDATIONS = [
  { type: 'Production databases', action: 'Zip and upload' },
  { type: 'PSTs and MBOXs', action: 'Upload directly' },
  { type: '50–100 loose files', action: 'Upload directly' },
  { type: '>100 loose files', action: 'Zip and upload' },
  { type: 'Folders', action: 'Zip and upload' },
] as const

const RESOURCES = [
  {
    title: 'GoldFynch 101',
    description: 'A step by step guide to get you started with basics of GoldFynch.',
    href: '#',
  },
  {
    title: 'GoldFynch documentation',
    description: 'Everything you need to know about GoldFynch.',
    href: '#',
  },
  {
    title: 'Request e-mail import',
    description: 'Use GoldFynch add-ons to request services like email accounts import.',
    href: '#',
  },
  {
    title: 'Get help',
    description: 'Directly get in touch with us to get your questions answered.',
    href: '#',
  },
] as const

type CaseStartHereLayoutProps = {
  caseRow: CaseRow
}

export default function CaseStartHereLayout({ caseRow: _caseRow }: CaseStartHereLayoutProps) {
  return (
    <div className="-mx-6 flex min-h-[calc(100dvh-16rem)] w-[calc(100%+3rem)] max-w-none flex-col justify-center px-6 py-[100px] font-lato lg:px-[200px]">
      <header className="text-center">
        <h2 className="font-lato text-lg font-semibold text-brandcolor-textstrong sm:text-xl">
          This is your new case, but it doesn&apos;t have any data yet.
        </h2>
        <p className="mt-2 text-sm text-brandcolor-textweak sm:text-base">
          Please upload your source files to get started.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-[40px]">
        <section className="min-w-0 rounded-md bg-brandcolor-white px-4 pb-8 pt-10 sm:px-6 lg:w-[70%] lg:shrink-0">
          <div
            className="flex w-full min-h-[300px] flex-col items-center justify-center rounded-md border-2 border-dotted border-brandcolor-secondary bg-brandcolor-fill px-10 py-14 text-center transition-colors hover:bg-brandcolor-secondaryfill/70"
            aria-label="Drag and drop to upload"
          >
            <GoogleDuotoneIcon
              name="upload_file"
              className="text-[48px] !text-brandcolor-secondary"
            />
            <p className="mt-5 max-w-md text-base font-semibold text-brandcolor-textstrong">
              Drag and drop to upload source file or
            </p>
            <p className="mt-2 max-w-md text-sm text-brandcolor-textweak">
              They will be automatically uploaded to your{' '}
              <span className="font-medium text-brandcolor-secondary">home directory</span>.
            </p>
            <button
              type="button"
              className="mt-5 rounded-md border border-brandcolor-strokeweak bg-brandcolor-white px-5 py-2.5 text-sm font-medium text-brandcolor-textstrong transition-colors hover:bg-brandcolor-fill"
            >
              Browse computer
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-brandcolor-textstrong">Our recommendations:</h3>
            <div className="mt-2 overflow-hidden rounded-md border border-brandcolor-strokeweak text-sm">
              <div className="grid grid-cols-[auto_1fr_1fr] gap-2 border-b border-brandcolor-strokeweak bg-brandcolor-fill px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brandcolor-textweak">
                <span aria-hidden />
                <span>Type</span>
                <span>Action</span>
              </div>
              {RECOMMENDATIONS.map((row) => (
                <div
                  key={row.type}
                  className="grid grid-cols-[auto_1fr_1fr] items-center gap-2 border-b border-brandcolor-strokeweak px-3 py-2 last:border-b-0"
                >
                  <GoogleDuotoneIcon
                    name="check"
                    className="text-[18px] !text-brandcolor-badge-success-text"
                  />
                  <span className="text-brandcolor-textstrong">{row.type}</span>
                  <span className="text-brandcolor-textweak">{row.action}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="min-w-0 lg:w-[30%] lg:shrink-0 lg:border-l lg:border-brandcolor-strokeweak lg:pl-[40px]">
          <h3 className="font-semibold text-brandcolor-textstrong">
            Resources to get you started:
          </h3>
          <ul className="mt-4 flex flex-col gap-5">
            {RESOURCES.map((resource) => (
              <li key={resource.title}>
                <a
                  href={resource.href}
                  className="group block transition-colors"
                >
                  <span className="inline-flex items-center gap-1 font-semibold text-brandcolor-secondary group-hover:text-brandcolor-secondaryhover">
                    {resource.title}
                    <GoogleDuotoneIcon
                      name="arrow_forward"
                      className="text-[18px] !text-brandcolor-secondary group-hover:!text-brandcolor-secondaryhover"
                    />
                  </span>
                  <p className="mt-1 text-sm text-brandcolor-textweak">{resource.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
