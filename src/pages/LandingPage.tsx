import PageContainer from '@/components/PageContainer'

export default function LandingPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold">Landing</h1>
      <p className="mt-2 text-slate-600">
        Prototypes live in <code className="font-mono text-sm">src/pages</code>.
        This route is <code className="font-mono text-sm">/</code>.
      </p>
    </PageContainer>
  )
}
