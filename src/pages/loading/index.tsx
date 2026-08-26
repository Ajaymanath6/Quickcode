import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const REDIRECT_DELAY_MS = 10_000

export default function LoadingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/case', { replace: true })
    }, REDIRECT_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <main className="flex min-h-dvh items-center justify-center bg-brandcolor-white font-lato text-brandcolor-textstrong">
      <div className="flex flex-col items-center px-6">
        <img
          src="/landing/goldfynch-bird.png"
          alt="GoldFynch"
          className="h-12 w-auto object-contain"
          width={48}
          height={48}
        />

        <div className="mt-8 w-48 border-t border-brandcolor-strokeweak" aria-hidden />

        <div className="mt-6 flex items-center gap-2 text-base text-brandcolor-textweak sm:text-lg">
          <p>Loading your cases…</p>
          <div
            className="size-[1em] shrink-0 animate-spin rounded-full border-2 border-brandcolor-strokeweak border-t-brandcolor-strokestrong"
            role="status"
            aria-hidden
          />
        </div>
      </div>
    </main>
  )
}
