'use client'

import StackedCards from '../../components/StackedCards'

const cardsToShow = [
  { rank: '2', suit: 'diamonds' },
  { rank: '10', suit: 'clubs' },
  { rank: 'K', suit: 'hearts' },
  { rank: 'A', suit: 'spades' },
]

export default function GamePage() {
  return (
    <main className="flex flex-col gap-6">
      <h2>It is brian's turn</h2>
      <StackedCards cards={cardsToShow} />
    </main>
  )
}
