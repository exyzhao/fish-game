'use client'

import { useState } from 'react'
import { useWebSocketContext } from './context/WebSocketContext'

const cardsToShow = [
  { rank: '2', suit: 'diamonds' },
  { rank: '10', suit: 'clubs' },
  { rank: 'K', suit: 'hearts' },
  { rank: 'A', suit: 'spades' },
]

export default function Home() {
  const { isConnected, sendMessage } = useWebSocketContext()
  const [playerName, setPlayerName] = useState('')
  const [gameId, setGameId] = useState('')
  const [waiting, setWaiting] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevents page reload
    if (!playerName.trim() || !gameId.trim()) {
      return
    }
    if (isConnected) {
      sendMessage({
        event: 'JOIN_GAME',
        gameId,
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
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
          />
          <button type="submit" disabled={!isConnected || waiting}>
            {waiting ? 'Joining...' : 'Join Lobby'}
          </button>
        </form>
      </main>
    </div>
  )
}
