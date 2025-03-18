import { Card } from './Card'

export default function StackedCards({
  cards,
}: {
  cards: { rank: string; suit: string }[]
}) {
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
          <Card rank={card.rank} suit={card.suit} />
        </div>
      ))}
    </div>
  )
}
