'use client'

import StackedCards from '../../components/StackedCards'
import { CardModel, Rank, Suit } from '@repo/shared-types/models'

const cardsToShow: CardModel[] = [
  { rank: Rank.TWO, suit: Suit.DIAMONDS },
  { rank: Rank.TEN, suit: Suit.CLUBS },
  { rank: Rank.KING, suit: Suit.HEARTS },
  { rank: Rank.ACE, suit: Suit.SPADES },
]

export default function GamePage() {
  return (
    <main className="flex flex-col gap-6">
      <h2>It is brian's turn</h2>
      <StackedCards cards={cardsToShow} />
    </main>
  )
}
