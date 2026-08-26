import { useEffect, useMemo, useRef, useState } from 'react'
import * as Slider from '@radix-ui/react-slider'
import AppHeader from '@/components/AppHeader'
import GoogleDuotoneIcon from '@/components/GoogleDuotoneIcon'

const CASE_TIERS = [
  { id: 0, storageLabel: '512 MB', costLabel: '$0.00/mo', costValue: 0 },
  { id: 1, storageLabel: '3 GB', costLabel: '$29.00/mo', costValue: 29 },
  { id: 2, storageLabel: '10 GB', costLabel: '$79.00/mo', costValue: 79 },
  { id: 3, storageLabel: '25 GB', costLabel: '$149.00/mo', costValue: 149 },
  { id: 4, storageLabel: '50 GB+', costLabel: '$249.00/mo', costValue: 249 },
] as const

const DEFAULT_TIER_INDEX = 1
const LAST_TIER_INDEX = CASE_TIERS.length - 1
const COST_ANIM_MS = 420
const AUTO_DETECTED_TIMEZONE = 'Asia/Calcutta'

const TIMEZONES: string[] =
  typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl
    ? Intl.supportedValuesOf('timeZone')
    : [AUTO_DETECTED_TIMEZONE]

function formatCost(value: number) {
  return `$${value.toFixed(2)}/mo`
}

function timezoneLabel(zone: string) {
  return zone === AUTO_DETECTED_TIMEZONE ? `${zone} [Auto-Detected]` : zone
}

function useAnimatedNumber(target: number, durationMs = COST_ANIM_MS) {
  const [display, setDisplay] = useState(target)
  const displayRef = useRef(target)

  useEffect(() => {
    const from = displayRef.current
    const to = target
    if (from === to) return

    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs)
      const eased = 1 - (1 - progress) ** 3
      const next = from + (to - from) * eased
      displayRef.current = next
      setDisplay(next)
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, durationMs])

  return display
}

export default function NewCasePage() {
  const [caseName, setCaseName] = useState('')
  const [timezone, setTimezone] = useState(AUTO_DETECTED_TIMEZONE)
  const [sliderValue, setSliderValue] = useState(DEFAULT_TIER_INDEX)
  const tierIndex = Math.min(LAST_TIER_INDEX, Math.max(0, Math.round(sliderValue)))
  const tier = CASE_TIERS[tierIndex]
  const animatedCost = useAnimatedNumber(tier.costValue)
  const sliderPercent = useMemo(
    () => (sliderValue / LAST_TIER_INDEX) * 100,
    [sliderValue],
  )

  function snapToNearest() {
    setSliderValue(tierIndex)
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-brandcolor-fill font-lato text-brandcolor-textstrong">
      <AppHeader />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-6 py-10 sm:py-12">
          <div className="text-center">
            <h1 className="font-catamaran text-3xl font-semibold tracking-tight sm:text-4xl">
              Create new case
            </h1>
            <p className="mt-3 text-base text-brandcolor-textweak sm:text-lg">
              Name your case, pick a storage type, and confirm timezone settings before creating.
            </p>
            <div
              className="mx-auto mt-6 w-full max-w-md border-t border-brandcolor-strokeweak"
              aria-hidden
            />
          </div>

          <label className="mt-8 block" htmlFor="new-case-name">
            <span className="mb-2 block text-sm font-medium text-brandcolor-textstrong">
              Case name
            </span>
            <input
              id="new-case-name"
              type="text"
              value={caseName}
              onChange={(event) => setCaseName(event.target.value)}
              placeholder="Enter a case name"
              className="w-full rounded-md border border-brandcolor-strokeweak bg-brandcolor-white px-3 py-2.5 text-sm text-brandcolor-textstrong placeholder:text-brandcolor-textweak focus:border-brandcolor-strokestrong focus:outline-none"
            />
          </label>

          <section className="mt-10 rounded-md border border-brandcolor-strokeweak bg-brandcolor-white p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-left text-lg font-semibold tracking-tight text-brandcolor-textstrong">
                Pricing
              </h2>
              <div className="mt-4 flex items-stretch justify-start gap-3 sm:gap-4">
                <div className="min-w-[9.5rem] rounded-md border border-brandcolor-strokeweak bg-brandcolor-fill px-4 py-3 text-left">
                  <p className="text-xs text-brandcolor-textweak">Storage</p>
                  <p
                    key={tier.storageLabel}
                    className="mt-1 whitespace-nowrap text-xl font-semibold text-brandcolor-textstrong [animation:value-flip_0.35s_ease] sm:text-2xl"
                    style={{ transformOrigin: 'center' }}
                  >
                    {tier.storageLabel}
                  </p>
                </div>
                <div className="flex items-center text-brandcolor-strokestrong" aria-hidden>
                  <GoogleDuotoneIcon
                    name="arrow_forward"
                    className="text-[22px] !text-brandcolor-strokestrong"
                  />
                </div>
                <div className="min-w-[9.5rem] rounded-md border border-brandcolor-strokeweak bg-brandcolor-fill px-4 py-3 text-left">
                  <p className="text-xs text-brandcolor-textweak">Cost</p>
                  <p className="mt-1 whitespace-nowrap text-xl font-semibold tabular-nums text-brandcolor-textstrong sm:text-2xl">
                    {formatCost(animatedCost)}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mb-10 flex justify-start">
              <div className="relative whitespace-nowrap rounded-md bg-brandcolor-secondary px-4 py-2 text-sm font-semibold text-brandcolor-white shadow-sm">
                Select your case type
                <span
                  className="absolute left-6 top-full border-x-8 border-t-8 border-x-transparent border-t-brandcolor-secondary"
                  aria-hidden
                />
              </div>
            </div>

            <div className="relative w-full pt-10">
              <div
                className="pointer-events-none absolute top-0 z-10 whitespace-nowrap rounded-full bg-brandcolor-secondary px-3 py-1 text-xs font-semibold text-brandcolor-white transition-[left] duration-150 ease-out"
                style={{
                  left: `${sliderPercent}%`,
                  transform: `translateX(-${sliderPercent}%)`,
                }}
              >
                <span
                  key={tier.storageLabel}
                  className="inline-block [animation:value-flip_0.35s_ease]"
                >
                  {tier.storageLabel}
                </span>
              </div>

              <Slider.Root
                className="relative flex h-6 w-full touch-none select-none items-center"
                value={[sliderValue]}
                min={0}
                max={LAST_TIER_INDEX}
                step={0.01}
                onValueChange={(value) => setSliderValue(value[0] ?? DEFAULT_TIER_INDEX)}
                onValueCommit={snapToNearest}
                aria-label="Case type storage"
              >
                <Slider.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-brandcolor-strokeweak">
                  <Slider.Range className="absolute h-full rounded-full bg-brandcolor-secondary transition-[right,left] duration-150 ease-out" />
                </Slider.Track>
                <Slider.Thumb className="block size-5 cursor-grab rounded-full border-2 border-brandcolor-secondary bg-brandcolor-white shadow-md outline-none transition-transform duration-150 ease-out hover:scale-110 focus-visible:ring-2 focus-visible:ring-brandcolor-secondary/40 active:cursor-grabbing active:scale-105" />
              </Slider.Root>

              <div className="mt-3 flex justify-between text-xs text-brandcolor-textweak sm:text-sm">
                {CASE_TIERS.map((item) => {
                  const isRecommended = item.id === DEFAULT_TIER_INDEX
                  const isActive = item.id === tierIndex
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSliderValue(item.id)}
                      className={`whitespace-nowrap transition-colors duration-200 hover:text-brandcolor-textstrong ${
                        isRecommended || isActive
                          ? 'font-semibold text-brandcolor-textstrong'
                          : ''
                      }`}
                    >
                      {item.storageLabel}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-8 w-full">
              <h3 className="text-base font-semibold text-brandcolor-textstrong">
                Drag slider to select case type.
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-brandcolor-textweak sm:text-base">
                <li>
                  Case type will determine how you&apos;re charged for this case and what limits you
                  have. Select a case type to see the costs and limitations.
                </li>
                <li>
                  When in doubt, just start with the{' '}
                  <span className="font-semibold text-brandcolor-textstrong">3GB</span> case.
                  It&apos;s seamless to upgrade.{' '}
                  <a href="#" className="font-medium text-brandcolor-secondary hover:underline">
                    Learn More
                  </a>
                  .
                </li>
              </ul>
            </div>
          </section>

          <section className="mt-6 rounded-md border border-brandcolor-strokeweak bg-brandcolor-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-brandcolor-textstrong">Case settings</h2>
            <div className="mt-4">
              <label className="block text-sm font-medium text-brandcolor-textstrong" htmlFor="case-timezone">
                TimeZone
              </label>
              <select
                id="case-timezone"
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                className="mt-2 w-full rounded-md border border-brandcolor-strokeweak bg-brandcolor-white px-3 py-2.5 text-sm text-brandcolor-textstrong focus:border-brandcolor-strokestrong focus:outline-none"
              >
                {TIMEZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {timezoneLabel(zone)}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-brandcolor-textweak">
                This setting will determine how dates and times are displayed and interpreted. This
                setting may not be changed once the case has been created.
              </p>
            </div>
          </section>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-brandcolor-secondary px-6 py-3 text-sm font-semibold text-brandcolor-white transition-colors hover:bg-brandcolor-secondaryhover disabled:opacity-50"
              disabled={!caseName.trim()}
            >
              Create case
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes value-flip {
          from {
            transform: rotateX(75deg);
            opacity: 0;
          }
          to {
            transform: rotateX(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
