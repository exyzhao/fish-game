import Image, { type ImageProps } from 'next/image'
import { Button } from '@repo/ui/button'
import { Card } from '../../../packages/ui/src/card'

type Props = Omit<ImageProps, 'src'> & {
  srcLight: string
  srcDark: string
}

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  )
}

const cardsToShow = [
  { rank: '2', suit: 'diamonds' },
  { rank: '10', suit: 'clubs' },
  { rank: 'K', suit: 'hearts' },
  { rank: 'A', suit: 'spades' },
]

function StackedCards({ cards }: { cards: { rank: string; suit: string }[] }) {
  return (
    <div className="relative h-[190px] w-[600px]">
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

export default function Home() {
  return (
    <div>
      <main>
        <div className="h-10 w-10 bg-amber-300"></div>
        {/* <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"> */}
        <div className="">
          <StackedCards cards={cardsToShow} />
        </div>
      </main>
    </div>
  )
}
