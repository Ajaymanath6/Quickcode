import { useLayoutWorkspace } from '@/context/LayoutWorkspaceContext'

export default function LayoutWorkspace() {
  const { entries } = useLayoutWorkspace()

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[var(--canvas-fill)]">
      <div className="flex min-h-0 flex-1 items-center justify-center p-8">
        <div className="max-w-md rounded-xl border border-dashed border-brandcolor-200 bg-white px-6 py-10 text-center">
          <h2 className="text-sm font-semibold text-brandcolor-900">Layout workspace</h2>
          <p className="mt-2 text-[13px] text-brandcolor-500">
            Use the sidebar composer to ask for a layout. Recent prompts stay in this workspace.
            Published components can be mentioned with @.
          </p>
          <p className="mt-4 text-[13px] text-brandcolor-700">
            {entries.length === 0
              ? 'No prompts yet.'
              : `${String(entries.length)} recent prompt${entries.length === 1 ? '' : 's'}.`}
          </p>
        </div>
      </div>
    </div>
  )
}
