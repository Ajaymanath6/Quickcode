import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  return <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
}
