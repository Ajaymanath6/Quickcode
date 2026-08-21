import { useState } from 'react'
import {
  RiBankLine,
  RiBookOpenLine,
  RiBox3Line,
  RiBuilding2Line,
  RiChat1Line,
  RiClipboardLine,
  RiCloudLine,
  RiCursorLine,
  RiEarthLine,
  RiFacebookFill,
  RiFolderLine,
  RiGlobeLine,
  RiGraduationCapLine,
  RiGroupLine,
  RiLightbulbLine,
  RiLinkedinFill,
  RiMap2Line,
  RiMoneyDollarCircleLine,
  RiSearchEyeLine,
  RiSettings3Line,
  RiShieldStarLine,
  RiShieldUserLine,
  RiSmartphoneLine,
  RiTwitterXFill,
  RiUploadCloud2Line,
} from '@remixicon/react'
import BrandLogo from '@/components/BrandLogo'

const WHY_FEATURES = [
  {
    title: 'Exceptional user experience.',
    body: 'Simple in-browser drag and drop uploads, all inclusive OCR, and effortless workflows.',
    icon: RiLightbulbLine,
    iconClass: 'text-[#E6B422]',
  },
  {
    title: 'Unrivaled file type support.',
    body: 'PDF, PST, MBOX, MSG, EML, DOC, DOCX, RTF, XLS, XLSX, PPT, PPTX, POTX, ODT, TIFF, JPEG, ZIP, RAR to name a few and always growing.',
    icon: RiFolderLine,
    iconClass: 'text-[#E07A2F]',
  },
  {
    title: "Pricing which doesn't break the bank.",
    body: 'Simple and predictable per-case pricing which is affordable and offers no surprises.',
    icon: RiMoneyDollarCircleLine,
    iconClass: 'text-brandcolor-secondary',
  },
  {
    title: 'Bank-grade security.',
    body: 'Financial industry standard safeguards your data, so breathe easy knowing that it is secure.',
    icon: RiCloudLine,
    iconClass: 'text-[#7B5EA7]',
  },
] as const

const COLLAB_FEATURES = [
  {
    title: 'Log in from anywhere',
    body: 'Log in and access your data from anywhere. GoldFynch runs on the cloud, so work on your case wherever you are. Just log in from your favorite device and you\'re ready to start.',
    icon: RiSmartphoneLine,
    iconClass: 'text-[#E07A2F]',
  },
  {
    title: 'Unlimited case sharing',
    body: 'Share a case with all involved peers. Everyone can upload and review data on a shared case. Collaborate with people in your office or around the world.',
    icon: RiGroupLine,
    iconClass: 'text-brandcolor-secondary',
  },
  {
    title: 'Access control',
    body: 'Restrict and revoke access of peers at any time. Turn users into admins, choose what you share.',
    icon: RiShieldUserLine,
    iconClass: 'text-[#C20205]',
  },
] as const

const EASE_FEATURES = [
  {
    title: 'Drag and drop uploads',
    body: 'Drag and drop files or folders using your browser window. Files will be automatically uploaded and processed for you.',
    icon: RiCursorLine,
    iconClass: 'text-[#7B5EA7]',
  },
  {
    title: 'Automatic and completely unintrusive OCR processing',
    body: 'All uploaded content is automatically processed through our processing pipelines. Any documents that may need OCR are automatically OCRed. Have images with text? GoldFynch will automatically detect and process such files.',
    icon: RiUploadCloud2Line,
    iconClass: 'text-[#E6B422]',
  },
  {
    title: 'Classify and code documents like never before',
    body: "Using GoldFynch's unified tagging system you never have to worry about or remember complex ways of coding a document. Tagging works as the basis of effective searches, document classification and fast productions.",
    icon: RiClipboardLine,
    iconClass: 'text-brandcolor-secondary',
  },
] as const

const TOOLS_FEATURES = [
  {
    title: 'Simple but effective searches',
    body: 'Search like you search the internet, and progressively refine your results till you find what you need. No complex search syntax. GoldFynch will automatically suggest search criterion and deliver blazing fast results.',
    icon: RiSearchEyeLine,
    iconClass: 'text-[#E07A2F]',
  },
  {
    title: 'Produce like a pro',
    body: 'A simplified production workflow lets you produce as often as you like with minimum resistance. No extra charge for productions.',
    icon: RiBox3Line,
    iconClass: 'text-[#7B5EA7]',
  },
  {
    title: 'Matter intelligence and linking',
    body: 'GoldFynch automatically extracts relevant entries from your matter and links it with documents so you know exactly what, where and when a particular document is talking about.',
    icon: RiShieldStarLine,
    iconClass: 'text-[#E6B422]',
  },
] as const

const INSTITUTION_TYPES = [
  { label: 'Non-profit organization', icon: RiBuilding2Line },
  { label: 'Government organization', icon: RiBankLine },
  { label: 'School', icon: RiBookOpenLine },
  { label: 'College or University', icon: RiGraduationCapLine },
] as const

const WORLD_REGIONS = [
  {
    code: 'US',
    detail: 'goldfynch.com',
    status: 'live' as const,
    flag: 'https://flagcdn.com/w160/us.png',
    flagAlt: 'United States flag',
  },
  {
    code: 'CA',
    detail: 'goldfynch.ca',
    status: 'live' as const,
    flag: 'https://flagcdn.com/w160/ca.png',
    flagAlt: 'Canada flag',
  },
  {
    code: 'UK',
    detail: 'goldfynch.uk',
    status: 'interest' as const,
    flag: 'https://flagcdn.com/w160/gb.png',
    flagAlt: 'United Kingdom flag',
  },
  {
    code: 'EU',
    detail: 'goldfynch.eu',
    status: 'interest' as const,
    flag: 'https://flagcdn.com/w160/eu.png',
    flagAlt: 'European Union flag',
  },
  {
    code: 'MORE',
    detail: 'Coming soon',
    status: 'soon' as const,
    flag: null,
    flagAlt: 'More regions',
  },
] as const

const TESTIMONIALS = [
  {
    quote:
      'I love the fact that you can pay by case, this is ideal for a small firm that needs to control costs. This was a critical tool for us to handle a case with a large volume of data ... We could not have properly prepared for trial within our budget without GoldFynch.',
    name: 'Jody Rater',
    firm: 'Rater Law Office',
  },
  {
    quote:
      'This is my first time using GoldFynch and just have to commend you on your customer service. These proactive emails are incredibly helpful, especially as a solo practitioner struggling to produce 250GB\'s to the feds. The interface is user friendly and the pricing is incredibly fair and reasonable.',
    name: 'Felix Valenzuela',
    firm: 'Valenzuela Law Firm',
  },
] as const

const TRUSTED_LOGOS = [
  {
    name: 'United States Forest Service',
    src: 'https://images.ctfassets.net/818uh3qw7u4q/6NS7bT59SV3xwtRtluonn9/871f67e6108121da78b6fc957fccb4ca/United_States_Forest_Service-Black_.svg',
  },
  {
    name: 'U.S. Securities and Exchange Commission',
    src: 'https://images.ctfassets.net/818uh3qw7u4q/3hK1IJNXc69helG5s0D0U9/4e52458bea6ffd6ce25a3739d22bfc95/SEC.svg',
  },
  {
    name: 'United States Courts',
    src: 'https://images.ctfassets.net/818uh3qw7u4q/yWt7FR0T14dnbvAuGJ7OA/9c2cbf804dfe43a558378be86edfed46/united-states-courts.svg',
  },
  {
    name: 'Charter Communications',
    src: 'https://images.ctfassets.net/818uh3qw7u4q/14PtSSZrAaWSqezx44yxYr/60a8d05483a36f9baca9be784c0e9dbe/Charter_Communications_Logo_Black.svg',
  },
  {
    name: 'U.S. Department of Defense',
    src: 'https://images.ctfassets.net/818uh3qw7u4q/3scYuNwsGZmKmzZBpSk0M5/acef3971bbf7d83849813b693360958f/DoD.svg',
  },
  {
    name: 'Elastic',
    src: 'https://images.ctfassets.net/818uh3qw7u4q/7Ghs2yeV1zhRsY5PKSn7Vd/ab0db980c10a5c62cb2b3873e133f1ac/elastic_Black.svg',
  },
] as const

const FEATURE_HIGHLIGHTS = [
  {
    title: 'Supports native documents, PSTs, MBOX, Load file productions, & more',
    graphic: 'formats' as const,
  },
  {
    title: 'Automatic processing at no extra charge',
    graphic: 'processing' as const,
  },
  {
    title: 'Pay-as-you-go, transparent, and prorated pricing',
    graphic: 'formats' as const,
  },
  {
    title: 'Unlimited collaborators, no user fees',
    graphic: 'formats' as const,
  },
] as const

const FEATURE_CARD_ICONS = [
  { src: '/landing/feature-icon-pst.png', alt: 'PST' },
  { src: '/landing/feature-icon-native.png', alt: 'Native documents' },
  { src: '/landing/feature-icon-mbox.png', alt: 'MBOX' },
  { src: '/landing/feature-icon-lfp.png', alt: 'Load file production' },
] as const

/** Bird mark on top; other format icons in a row below. */
function FeatureFormatsGraphic() {
  return (
    <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-5 sm:min-h-[220px]" aria-hidden>
      <img
        src="/landing/feature-icon-center.png"
        alt=""
        className="h-16 w-16 object-contain sm:h-20 sm:w-20"
        width={80}
        height={80}
        loading="lazy"
        decoding="async"
      />
      <div className="flex w-full items-center justify-center gap-2.5">
        {FEATURE_CARD_ICONS.map((icon) => (
          <img
            key={icon.src}
            src={icon.src}
            alt=""
            className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            width={36}
            height={36}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </div>
  )
}

/** Format icons (no center mark) + settings, conveying $0 processing. */
function FeatureProcessingGraphic() {
  return (
    <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-4 sm:min-h-[220px]" aria-hidden>
      <div className="flex w-full flex-wrap items-center justify-center gap-2.5">
        {FEATURE_CARD_ICONS.map((icon) => (
          <img
            key={icon.src}
            src={icon.src}
            alt=""
            className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            width={36}
            height={36}
            loading="lazy"
            decoding="async"
          />
        ))}
        <RiSettings3Line
          className="size-8 text-brandcolor-textweak sm:size-9"
          aria-hidden
        />
      </div>
      <p className="font-catamaran text-4xl font-bold tracking-tight text-brandcolor-secondary sm:text-5xl">
        $0
      </p>
    </div>
  )
}

function FeatureCardGraphic({ variant }: { variant: 'formats' | 'processing' }) {
  if (variant === 'processing') {
    return <FeatureProcessingGraphic />
  }
  return <FeatureFormatsGraphic />
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="font-catamaran text-center text-4xl font-semibold tracking-tight text-brandcolor-textstrong sm:text-[2.5rem]">
      {children}
      <span
        className="mx-auto mt-3 block h-0.5 w-16 bg-brandcolor-secondary"
        aria-hidden
      />
    </h2>
  )
}

/** “Why GoldFynch?” — brand mark from header logo instead of the word. */
function WhyBrandTitle() {
  return (
    <h2 className="flex flex-col items-center gap-3 text-center">
      <span className="flex flex-wrap items-center justify-center gap-2 font-catamaran text-4xl font-semibold tracking-tight text-brandcolor-textstrong sm:text-[2.5rem]">
        <span>Why</span>
        <img
          src="/landing/logo.png"
          alt="GoldFynch"
          className="h-10 w-auto sm:h-12"
          width={401}
          height={78}
        />
        <span aria-hidden>?</span>
      </span>
      <span className="h-0.5 w-16 bg-brandcolor-secondary" aria-hidden />
    </h2>
  )
}

function YellowCta({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="mt-8 inline-flex rounded-none bg-brandcolor-primary px-6 py-3 text-sm font-semibold text-brandcolor-textstrong transition-colors hover:bg-brandcolor-primaryhover"
    >
      {children}
    </a>
  )
}

function CtaPair() {
  return (
    <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
      <a
        href="#how-it-works"
        className="inline-flex rounded-none bg-brandcolor-secondary px-6 py-3 text-sm font-semibold text-brandcolor-white transition-colors hover:bg-brandcolor-secondaryhover"
      >
        See how it works »
      </a>
      <a
        href="#signup"
        className="inline-flex rounded-none bg-brandcolor-primary px-6 py-3 text-sm font-semibold text-brandcolor-textstrong transition-colors hover:bg-brandcolor-primaryhover"
      >
        Create a free account »
      </a>
    </div>
  )
}

export default function LandingPage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const testimonial = TESTIMONIALS[testimonialIndex] ?? TESTIMONIALS[0]

  return (
    <div className="font-lato">
      <section
        id="features"
        className="landing-hero relative isolate overflow-hidden px-4 py-24 text-brandcolor-white sm:px-8"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#1a1a1a]" aria-hidden />
        <div className="landing-hero-waves pointer-events-none absolute inset-0 -z-10 opacity-40" aria-hidden />

        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-12">
          <div className="text-left">
            <h1 className="font-catamaran text-[clamp(1.5rem,3.2vw,2.75rem)] font-medium leading-tight tracking-[-0.02em] text-brandcolor-white">
              Powerful eDiscovery. Without the enterprise price tag.
            </h1>
            <p className="mt-5 max-w-xl font-lato text-[1.125rem] font-medium leading-[1.75rem] text-white/75">
              GoldFynch makes it simple to collect, search, review, and produce case documents — with
              transparent pricing, unlimited collaborators, and no complicated setup.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                id="signup"
                href="#signup"
                className="inline-flex rounded-none border border-brandcolor-primary/90 bg-transparent px-6 py-3 text-sm font-semibold text-brandcolor-primary transition-colors hover:bg-brandcolor-primary/10"
              >
                Start your free case →
              </a>
              <a
                id="schedule-demo"
                href="#schedule-demo"
                className="inline-flex rounded-none border border-brandcolor-white bg-brandcolor-white px-6 py-3 text-sm font-semibold text-brandcolor-textstrong transition-colors hover:bg-brandcolor-fill"
              >
                Get started
              </a>
            </div>
          </div>

          <div id="how-it-works" className="flex justify-center md:justify-end">
            <div className="w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-[#111] shadow-lg sm:max-w-lg">
              <img
                src="/landing/dashboard-mock.png"
                alt="See how it works — GoldFynch workspace preview"
                className="block h-auto w-full"
                width={800}
                height={480}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-[#1a1a1a] px-4 py-[110px] text-brandcolor-white sm:px-8"
        aria-labelledby="trusted-by-heading"
      >
        <div className="mx-auto max-w-5xl text-center">
          <h2
            id="trusted-by-heading"
            className="font-catamaran text-[14px] font-bold tracking-tight text-brandcolor-white"
          >
            Trusted by all
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-lato text-[25px] leading-snug text-white/70">
            The World&apos;s Most Influential
            <br />
            Corporations and Government Agencies
          </p>
        </div>

        <div className="landing-logo-marquee-fade mt-12 overflow-hidden">
          <div className="landing-logo-marquee flex w-max items-center gap-16 pr-16">
            {[...TRUSTED_LOGOS, ...TRUSTED_LOGOS].map((logo, index) => (
              <img
                key={`${logo.name}-${index}`}
                src={logo.src}
                alt={logo.name}
                className="h-[52px] w-auto max-w-[208px] shrink-0 object-contain opacity-70 brightness-0 invert sm:h-[62px] sm:max-w-[234px]"
                width={234}
                height={62}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="why"
        className="landing-pattern relative px-4 py-16 text-brandcolor-textstrong sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURE_HIGHLIGHTS.map((item) => (
              <article
                key={item.title}
                className="flex h-full min-h-[340px] flex-col border border-brandcolor-strokeweak bg-brandcolor-white p-6 sm:min-h-[380px]"
              >
                <div className="flex flex-1 flex-col justify-start">
                  <FeatureCardGraphic variant={item.graphic} />
                </div>
                <p className="mt-auto pt-5 font-lato text-[16px] font-semibold leading-snug text-brandcolor-textstrong">
                  {item.title}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <WhyBrandTitle />
          <p className="mx-auto mt-5 max-w-2xl text-center text-base text-brandcolor-textweak sm:text-lg">
            Feature-rich eDiscovery with transparent and affordable pricing.
          </p>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-14">
            {WHY_FEATURES.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="flex gap-4">
                  <Icon className={`mt-0.5 size-10 shrink-0 ${item.iconClass}`} aria-hidden />
                  <div>
                    <h3 className="font-lato text-lg font-bold text-brandcolor-textstrong">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brandcolor-textweak sm:text-[15px]">
                      {item.body}{' '}
                      <a
                        href="#how-it-works"
                        className="font-medium text-brandcolor-secondary hover:underline"
                      >
                        Learn More »
                      </a>
                    </p>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#how-it-works"
              className="inline-flex rounded-none bg-brandcolor-secondary px-6 py-3 text-sm font-semibold text-brandcolor-white transition-colors hover:bg-brandcolor-secondaryhover"
            >
              See how it works »
            </a>
            <a
              href="#signup"
              className="inline-flex rounded-none bg-brandcolor-primary px-6 py-3 text-sm font-semibold text-brandcolor-textstrong transition-colors hover:bg-brandcolor-primaryhover"
            >
              Create a free account »
            </a>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="landing-pattern relative border-t border-brandcolor-strokeweak/60 px-4 py-16 text-brandcolor-textstrong sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <SectionTitle>Collaborative eDiscovery, on the go</SectionTitle>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base text-brandcolor-textweak sm:text-lg">
            GoldFynch runs on the cloud, which means it goes where you go. Share cases with all your
            collaborators.
          </p>

          <div className="mt-12 grid items-start gap-10 md:grid-cols-2 md:gap-12">
            <div className="overflow-hidden rounded-md border border-brandcolor-strokeweak bg-brandcolor-white shadow-card">
              <img
                src="/landing/summary-panel.png"
                alt="Case summary panel with usage stats and top file types chart"
                className="block h-auto w-full"
                width={740}
                height={339}
              />
            </div>

            <div className="flex flex-col gap-8">
              {COLLAB_FEATURES.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="flex gap-4">
                    <Icon className={`mt-0.5 size-10 shrink-0 ${item.iconClass}`} aria-hidden />
                    <div>
                      <h3 className="font-lato text-lg font-bold text-brandcolor-textstrong">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-brandcolor-textweak sm:text-[15px]">
                        {item.body}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <CtaPair />
        </div>
      </section>

      <section
        id="ease-of-use"
        className="landing-pattern relative border-t border-brandcolor-strokeweak/60 px-4 py-16 text-brandcolor-textstrong sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <SectionTitle>Unprecedented ease of use</SectionTitle>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base text-brandcolor-textweak sm:text-lg">
            Industry and UI experts came together to design GoldFynch&apos;s user interface. Effortless
            user experience and zero learning curve are our prime directives.
          </p>

          <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-8">
            {EASE_FEATURES.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="flex gap-4">
                  <Icon className={`mt-0.5 size-10 shrink-0 ${item.iconClass}`} aria-hidden />
                  <div>
                    <h3 className="font-lato text-lg font-bold text-brandcolor-textstrong">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brandcolor-textweak sm:text-[15px]">
                      {item.body}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>

          <CtaPair />
        </div>
      </section>

      <section
        id="tools"
        className="landing-pattern relative border-t border-brandcolor-strokeweak/60 px-4 py-16 text-brandcolor-textstrong sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <SectionTitle>Tools you&apos;re used to, only better</SectionTitle>
          <p className="mx-auto mt-5 max-w-3xl text-center text-base text-brandcolor-textweak sm:text-lg">
            From re-thought searches to production workflows, everything in GoldFynch has been built
            ground up to deliver the best possible user experience.
          </p>

          <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {TOOLS_FEATURES.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="text-center sm:text-left">
                  <Icon className={`mx-auto size-10 sm:mx-0 ${item.iconClass}`} aria-hidden />
                  <h3 className="mt-4 font-lato text-lg font-bold text-brandcolor-textstrong">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brandcolor-textweak sm:text-[15px]">
                    {item.body}
                  </p>
                </article>
              )
            })}
          </div>

          <div className="mt-12 overflow-hidden rounded-md border border-brandcolor-strokeweak bg-brandcolor-white shadow-card">
            <img
              src="/landing/production-wizard.png"
              alt="Production wizard final review with file statistics and selected production options"
              className="block h-auto w-full"
              width={1024}
              height={544}
            />
          </div>

          <CtaPair />
        </div>
      </section>

      <section
        id="institutions"
        className="landing-pattern relative border-t border-brandcolor-strokeweak/60 px-4 py-16 text-brandcolor-textstrong sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-5xl text-center">
          <SectionTitle>GoldFynch for Institutions</SectionTitle>
          <p className="mx-auto mt-5 max-w-2xl text-base text-brandcolor-textweak sm:text-lg">
            Are you a non-profit, educational institutions, or government organization?
          </p>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {INSTITUTION_TYPES.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-3 rounded-xl border border-brandcolor-strokeweak bg-brandcolor-white px-4 py-6 shadow-sm"
                >
                  <Icon className="size-12 text-brandcolor-textstrong" aria-hidden />
                  <span className="text-sm font-semibold leading-snug text-brandcolor-textstrong">
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>

          <p className="mx-auto mt-10 max-w-xl text-sm text-brandcolor-textweak sm:text-base">
            Make use of tools and discounts catered to your needs.
          </p>
          <YellowCta href="#contact">Learn more here &gt;</YellowCta>
        </div>
      </section>

      <section
        id="worldwide"
        className="landing-pattern relative border-t border-brandcolor-strokeweak/60 px-4 py-16 text-brandcolor-textstrong sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-5xl text-center">
          <SectionTitle>GoldFynch around the world</SectionTitle>
          <p className="mx-auto mt-5 max-w-2xl text-base text-brandcolor-textweak sm:text-lg">
            GoldFynch offers localized data hosting and pricing in select countries.
          </p>

          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-start justify-center gap-8 sm:gap-10">
            {WORLD_REGIONS.map((region) => (
              <div key={region.code} className="flex w-28 flex-col items-center gap-3 sm:w-32">
                <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full border border-brandcolor-strokeweak bg-brandcolor-white shadow-sm sm:size-28">
                  {region.flag ? (
                    <img
                      src={region.flag}
                      alt={region.flagAlt}
                      className="size-full object-cover"
                      width={160}
                      height={160}
                      loading="lazy"
                    />
                  ) : (
                    <span className="flex size-full flex-col items-center justify-center gap-1 bg-[#2A9D8F] text-brandcolor-white">
                      <RiGlobeLine className="size-8" aria-hidden />
                      <span className="px-2 text-center text-[10px] font-bold uppercase leading-tight">
                        More coming soon
                      </span>
                    </span>
                  )}
                  {region.status === 'interest' ? (
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-[#C20205] py-1 text-center text-[9px] font-bold uppercase tracking-wide text-brandcolor-white">
                      Register interest
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1.5 text-brandcolor-textweak" aria-hidden>
                  <RiMap2Line className="size-4" />
                  <RiEarthLine className="size-4" />
                </div>
                <p className="text-sm font-medium text-brandcolor-textstrong">{region.detail}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-sm text-brandcolor-textweak sm:text-base">
            GoldFynch is available in multiple countries and regions, helping legal professionals
            worldwide comply with data residency laws.
          </p>
          <YellowCta href="#worldwide">View available countries &gt;</YellowCta>
        </div>
      </section>

      <section
        id="testimonials"
        className="relative border-t border-brandcolor-strokeweak/60 bg-brandcolor-white px-4 py-16 text-brandcolor-textstrong sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-catamaran text-3xl font-semibold tracking-tight text-brandcolor-textstrong sm:text-4xl">
            What Our Customers Say
          </h2>
          <blockquote className="mt-8 text-base leading-relaxed text-brandcolor-textweak sm:text-lg">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <div className="mx-auto mt-6 h-0.5 w-12 bg-brandcolor-primary" aria-hidden />
          <p className="mt-4 text-base font-semibold text-brandcolor-secondary">{testimonial.name}</p>
          <p className="mt-1 text-sm text-brandcolor-textstrong">{testimonial.firm}</p>

          <div className="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label="Testimonials">
            {TESTIMONIALS.map((item, index) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={index === testimonialIndex}
                aria-label={`Show testimonial from ${item.name}`}
                className={`size-2.5 rounded-full transition-colors ${
                  index === testimonialIndex ? 'bg-brandcolor-textstrong' : 'bg-brandcolor-strokeweak'
                }`}
                onClick={() => setTestimonialIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <footer
        id="contact"
        className="border-t border-brandcolor-strokeweak bg-brandcolor-white px-4 py-12 text-sm text-brandcolor-textstrong sm:px-8"
      >
        <div className="mx-auto mb-8 h-0.5 w-12 bg-brandcolor-primary" aria-hidden />
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3 md:items-start">
          <div className="space-y-2 text-brandcolor-textweak md:text-left">
            <p>1365 Dubuque Street, Iowa City, IA 52240</p>
            <p>
              <a href="#contact" className="hover:text-brandcolor-secondary">
                Contact
              </a>
              {' / '}
              <a href="mailto:hello@goldfynch.com" className="hover:text-brandcolor-secondary">
                Email
              </a>
              {' / '}
              <a href="tel:+18663197983" className="hover:text-brandcolor-secondary">
                +1-866-319-7983
              </a>
            </p>
            <p>
              <a href="#contact" className="hover:text-brandcolor-secondary">
                Manage Cookie Preferences
              </a>
              {' / '}
              <a href="#features" className="hover:text-brandcolor-secondary">
                Services
              </a>
              {' / '}
              <a href="#why" className="hover:text-brandcolor-secondary">
                About Us
              </a>
            </p>
          </div>

          <div className="flex justify-center">
            <BrandLogo imgClassName="h-10 w-auto max-w-[220px] object-contain" />
          </div>

          <div className="space-y-3 text-brandcolor-textweak md:text-right">
            <div className="flex items-center gap-3 md:justify-end">
              <a href="#contact" aria-label="Facebook" className="hover:text-brandcolor-secondary">
                <RiFacebookFill className="size-5" />
              </a>
              <a href="#contact" aria-label="X" className="hover:text-brandcolor-secondary">
                <RiTwitterXFill className="size-5" />
              </a>
              <a href="#contact" aria-label="LinkedIn" className="hover:text-brandcolor-secondary">
                <RiLinkedinFill className="size-5" />
              </a>
            </div>
            <p>
              <a href="#resources" className="hover:text-brandcolor-secondary">
                Blog
              </a>
              {' / '}
              <a href="#support" className="hover:text-brandcolor-secondary">
                FAQ
              </a>
              {' / '}
              <a href="#resources" className="hover:text-brandcolor-secondary">
                Glossary
              </a>
            </p>
            <p>Legal / All Rights Reserved / Copyright 2026</p>
            <p>
              Available in: US - Worldwide
              <br />
              Canada - UK (coming soon) - EU (coming soon)
            </p>
          </div>
        </div>
      </footer>

      <a
        href="#contact"
        className="fixed bottom-5 right-5 z-40 flex size-11 items-center justify-center rounded-none bg-brandcolor-strokemild text-brandcolor-white shadow-lg transition-colors hover:bg-brandcolor-textweak"
        aria-label="Open chat"
      >
        <RiChat1Line className="size-5" />
      </a>

      <div id="pricing" className="sr-only">
        Pricing
      </div>
      <div id="support" className="sr-only">
        Support
      </div>
      <div id="resources" className="sr-only">
        Resources
      </div>
    </div>
  )
}
