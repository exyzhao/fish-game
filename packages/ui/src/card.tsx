const suits = ['hearts', 'clubs', 'diamonds', 'spades']
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

const scaleFactor = 2

export function Card({ rank, suit }: { rank: string; suit: string }) {
  const suitIndex = suits.indexOf(suit)
  const rankIndex = ranks.indexOf(rank)

  const cardWidth = 71
  const cardHeight = 95
  const offsetX = -rankIndex * cardWidth
  const offsetY = -suitIndex * cardHeight

  return (
    <div
      style={{
        width: cardWidth * scaleFactor,
        height: cardHeight * scaleFactor,
        transform: `scale(${scaleFactor})`,
        transformOrigin: 'top left',
        display: 'inline-block',
        imageRendering: 'pixelated',
      }}
    >
      <div
        style={{
          width: cardWidth,
          height: cardHeight,
          backgroundColor: '#FFFFFF',
          backgroundImage: "url('/balatro-card-sprites.png')",
          backgroundPosition: `${offsetX}px ${offsetY}px`,
          backgroundRepeat: 'no-repeat',
          borderRadius: '4px',
        }}
      />
    </div>
  )
}
