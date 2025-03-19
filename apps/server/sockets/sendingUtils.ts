import { MyWebSocket, MyWebSocketServer } from '.'
import { ServerMessage, ServerEvent } from '@repo/shared-types'
import { LobbyId } from '../models'

// Helper function to broadcast a message to all clients in a game
export const broadcastToLobby = (
  wss: MyWebSocketServer,
  lobbyId: LobbyId,
  message: ServerMessage,
) => {
  const payload = JSON.stringify(message)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.lobbyId === lobbyId) {
      client.send(payload)
    }
  })
}

// Helper function to send a private message to a specific client
export const sendPrivateMessage = (
  wss: MyWebSocketServer,
  clientId: string,
  message: ServerMessage,
) => {
  const payload = JSON.stringify(message)
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

// It's pretty common to send an error message back to the websocket directly
export const sendErrorToWs = (ws: MyWebSocket, error: string) => {
  sendPrivateMessageToWs(ws, {
    event: ServerEvent.ERROR,
    data: { error },
  })
}
