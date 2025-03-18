import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'

interface MyWebSocket extends WebSocket {
  gameId?: string
  playerId?: string
}

interface MyWebSocketServer extends WebSocketServer {
  clients: Set<MyWebSocket>
}

interface Player {
  id: string
  name: string
}

interface Game {
  gameId: string
  lobbyPlayers: Player[]
}

const GAMES: Record<string, Game> = {}

export const handleJoinGame = (
  ws: MyWebSocket,
  message: { gameId?: string; playerName?: string },
  wss: MyWebSocketServer,
) => {
  const { gameId, playerName } = message

  if (!gameId || !playerName) {
    return ws.send(
      JSON.stringify({
        event: 'ERROR',
        error: 'Missing gameId or playerName',
      }),
    )
  }

  // If game doesn't exist, create it
  if (!GAMES[gameId]) {
    GAMES[gameId] = {
      gameId: gameId,
      lobbyPlayers: [],
    }
  }

  const game = GAMES[gameId]
}

// Helper function to broadcast a message to all clients in a game
export const broadcastToGame = (
  wss: MyWebSocketServer,
  gameId: string,
  data: object,
) => {
  const payload = JSON.stringify(data)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.gameId === gameId) {
      client.send(payload)
    }
  })
}

// Helper function to send a private message to a specific client
const sendPrivateMessage = (
  wss: MyWebSocketServer,
  clientId: string,
  data: object,
) => {
  const payload = JSON.stringify(data)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.playerId === clientId) {
      client.send(payload)
    }
  })
}
