export function navRowClass(active: boolean): string {
  return [
    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors',
    active
      ? 'border border-brandcolor-strokeweak bg-white font-medium text-brandcolor-textstrong'
      : 'border border-transparent text-brandcolor-textstrong hover:bg-white/70',
  ].join(' ')
}

export const sidebarChromeClass =
  'flex h-full w-[260px] max-w-[360px] min-w-[240px] flex-col border-r border-brandcolor-strokeweak bg-brandcolor-neutralhover/80'
