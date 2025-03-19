import { CardModel } from '../../../../packages/shared-types/models'

const CARD_WIDTH = 71
const CARD_HEIGHT = 95

const suits = ['HEARTS', 'CLUBS', 'DIAMONDS', 'SPADES']
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

const scaleFactor = 2

export function Card({ card }: { card: CardModel }) {
  console.log('card ' + card.rank + card.suit)
  const suitIndex = suits.indexOf(card.suit)
  const rankIndex = ranks.indexOf(card.rank)

  const offsetX = -rankIndex * CARD_WIDTH * scaleFactor
  const offsetY = -suitIndex * CARD_HEIGHT * scaleFactor

  return (
    <div
      style={{
        width: CARD_WIDTH * scaleFactor + 2,
        height: CARD_HEIGHT * scaleFactor + 2,
        backgroundColor: '#FFFFFF',
        backgroundImage: "url('/balatro-card-sprites.png')",
        backgroundPosition: `${offsetX}px ${offsetY}px`,
        backgroundSize: `${13 * CARD_WIDTH * 2}px ${4 * CARD_HEIGHT * 2}px`,
        backgroundRepeat: 'no-repeat',
        borderRadius: '8px',
        border: 'solid 1px #AAAAAA',
        imageRendering: 'pixelated',
      }}
    />
  )
}
