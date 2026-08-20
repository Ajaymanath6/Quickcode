export function navRowClass(active: boolean): string {
  return [
    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors',
    active
      ? 'border border-brandcolor-200 bg-white font-medium text-brandcolor-900'
      : 'border border-transparent text-brandcolor-700 hover:bg-white/70',
  ].join(' ')
}

export const sidebarChromeClass =
  'flex h-full w-[260px] max-w-[360px] min-w-[240px] flex-col border-r border-brandcolor-200 bg-brandcolor-100/80'
