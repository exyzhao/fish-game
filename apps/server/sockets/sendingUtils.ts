import { MyWebSocket, MyWebSocketServer } from '.'
import { ServerMessage } from '@repo/shared-types'

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
export const sendPrivateMessage = (
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

// If we already have the websocket, we can just send a message to it directly
export const sendPrivateMessageToWs = (
  ws: MyWebSocket,
  message: ServerMessage,
) => {
  ws.send(JSON.stringify(message))
}
