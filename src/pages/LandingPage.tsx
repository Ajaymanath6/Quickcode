import { Link } from 'react-router-dom'
import PageContainer from '@/components/PageContainer'

export default function LandingPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold">QuickCode</h1>
      <p className="mt-2 text-slate-600">
        Build component prototypes on the canvas, then publish them to the catalog.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/catalog/home"
          className="rounded-md bg-brandcolor-700 px-4 py-2 text-sm font-medium text-white"
        >
          Open catalog
        </Link>
        <Link
          to="/admin/canvas"
          className="rounded-md border border-brandcolor-200 bg-white px-4 py-2 text-sm font-medium text-brandcolor-700"
        >
          Open canvas
        </Link>
      </div>
    </PageContainer>
  )
}
