'use client'

import { useState } from 'react'
import { useWebSocketContext } from './context/WebSocketContext'
import Image, { type ImageProps } from 'next/image'
import { Button } from '@repo/ui/button'
import { Card } from '@repo/ui/card'

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
  const { isConnected, sendMessage } = useWebSocketContext()
  const [playerName, setPlayerName] = useState('')
  const [lobbyCode, setLobbyCode] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevents page reload

    if (!playerName.trim() || !lobbyCode.trim()) {
      return
    }

    if (isConnected) {
      sendMessage({
        event: 'JOIN_GAME',
        lobbyId: lobbyCode,
        playerName,
      })
    }
  }

  return (
    <div>
      <main>
        <p>Enter a lobby code and your name to start/join a game.</p>
        <form className="flex max-w-72 flex-col gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter lobby code"
            value={lobbyCode}
            onChange={(e) => setLobbyCode(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
          />
          {/* <button type="submit" disabled={!isConnected || waiting}>
            {waiting ? 'Joining...' : 'Join Lobby'}
          </button> */}
        </form>

        <div className="h-10 w-10 bg-amber-300"></div>
        {/* <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"> */}
        <div className="">
          <StackedCards cards={cardsToShow} />
        </div>
      </main>
    </div>
  )
}
