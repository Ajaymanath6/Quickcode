import { useRef } from 'react'
import type { DragEvent, KeyboardEvent } from 'react'
import CatalogCard from '@/components/catalog/CatalogCard'
import type { CatalogCardModel } from '@/lib/canvas-types'

type Props = {
  cards: CatalogCardModel[]
  onOpen: (card: CatalogCardModel) => void
  onDragStart?: (card: CatalogCardModel, event: DragEvent<HTMLButtonElement>) => void
  className?: string
}

export default function CatalogGrid({ cards, onOpen, onDragStart, className = '' }: Props) {
  const gridRef = useRef<HTMLDivElement>(null)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      return
    }
    const buttons = [...(gridRef.current?.querySelectorAll<HTMLButtonElement>('article > button') ?? [])]
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (current < 0) {
      return
    }
    const columns = Math.max(
      1,
      Math.round((gridRef.current?.clientWidth ?? 1) / (buttons[current].clientWidth || 1)),
    )
    const delta =
      event.key === 'ArrowLeft'
        ? -1
        : event.key === 'ArrowRight'
          ? 1
          : event.key === 'ArrowUp'
            ? -columns
            : columns
    const next = buttons[current + delta]
    if (next) {
      event.preventDefault()
      next.focus()
    }
  }

  return (
    <div
      ref={gridRef}
      className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
      onKeyDown={onKeyDown}
    >
      {cards.map((card) => (
        <CatalogCard
          key={card.entry.componentId}
          card={card}
          onOpen={onOpen}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  )
}
