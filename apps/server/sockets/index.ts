import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'

import {
  handleJoinLobby,
  handleLeaveLobby,
  handleHostStartGame,
} from './handlers'
import { ClientEvent, ClientMessage } from '@repo/shared-types'

const DEBUG_MODE = true

export interface MyWebSocket extends WebSocket {
  lobbyId?: string
  playerId?: string
}

export interface MyWebSocketServer extends WebSocketServer {
  clients: Set<MyWebSocket>
}

const messageHandlers: Record<
  ClientEvent,
  (ws: MyWebSocket, data: any, wss: MyWebSocketServer) => void
> = {
  [ClientEvent.JOIN_LOBBY]: handleJoinLobby,
  [ClientEvent.LEAVE_LOBBY]: handleLeaveLobby,
  [ClientEvent.HOST_START_GAME]: handleHostStartGame,
  [ClientEvent.DISCONNECT_GAME]: () => {},
  [ClientEvent.ASK_FOR_CARD]: () => {},
  [ClientEvent.DECLARE_FISH]: () => {},
  [ClientEvent.DECLARE_COUNTERFISH]: () => {},
}

export const initWebSockets = (server: import('http').Server) => {
  const wss = new WebSocketServer({ server }) as MyWebSocketServer

  wss.on('connection', (ws: MyWebSocket, req: IncomingMessage) => {
    if (DEBUG_MODE) {
      console.log('Client connected')
    }

    ws.on('message', (msg: string) => {
      if (DEBUG_MODE) {
        console.log('Received message:', msg)
      }

      let clientMessage: ClientMessage
      try {
        clientMessage = JSON.parse(msg)
      } catch (e) {
        ws.send(JSON.stringify({ error: 'Receieved invalid JSON from client' }))
        return
      }

      if (!messageHandlers[clientMessage.event]) {
        ws.send(JSON.stringify({ error: 'Unknown event' }))
        return
      }

      messageHandlers[clientMessage.event](ws, clientMessage.data, wss)
    })

    ws.on('close', () => {
      if (DEBUG_MODE) {
        console.log('Client disconnected')
      }
    })
  })
}
