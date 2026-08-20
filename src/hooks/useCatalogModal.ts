import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CatalogCardModel } from '@/lib/canvas-types'

export function useCatalogModal(cards: CatalogCardModel[]) {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get('id')
  const selectedCard = useMemo(
    () =>
      cards.find(
        (card) =>
          card.entry.componentId === selectedId || card.entry.id === selectedId,
      ) ?? null,
    [cards, selectedId],
  )

  const openCard = (card: CatalogCardModel) => {
    const next = new URLSearchParams(searchParams)
    next.set('id', card.entry.id ?? card.entry.componentId)
    setSearchParams(next)
  }

  const closeCard = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('id')
    setSearchParams(next, { replace: true })
  }

  return {
    open: Boolean(selectedCard),
    selectedCard,
    openCard,
    closeCard,
  }
}
