import { CardModel } from '@repo/shared-types/models'
import { Card } from './Card'

export default function StackedCards({ cards }: { cards: CardModel[] }) {
  return (
    <div className="relative h-[192px] w-[600px]">
      {cards.map((card, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${index * 90}px`,
            // transform: `rotate(${index * 5}deg)`,
          }}
        >
          <Card card={card} />
        </div>
      ))}
    </div>
  )
}
