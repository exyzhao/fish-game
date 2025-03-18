import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'

import { handleJoinGame } from './handlers'
import {
  ClientEvent,
  ClientMessage,
} from '../../common/messages/clientMessages'

export interface MyWebSocket extends WebSocket {
  gameId?: string
  playerId?: string
}

export interface MyWebSocketServer extends WebSocketServer {
  clients: Set<MyWebSocket>
}

export const initWebSockets = (server: import('http').Server) => {
  const wss = new WebSocketServer({ server }) as MyWebSocketServer

  wss.on('connection', (ws: MyWebSocket, req: IncomingMessage) => {
    console.log('Client connected')

    ws.on('message', (msg: string) => {
      let clientMessage: ClientMessage
      try {
        clientMessage = JSON.parse(msg)
      } catch (e) {
        ws.send(JSON.stringify({ error: 'Receieved invalid JSON from client' }))
        return
      }

      console.log('Client message:', clientMessage)

      switch (clientMessage.event) {
        case ClientEvent.JOIN_LOBBY:
          handleJoinGame(ws, clientMessage.data, wss)
          break
        default:
          ws.send(JSON.stringify({ error: 'Unknown event' }))
          break
      }
    })

    ws.on('close', () => {
      console.log('Client disconnected')
    })
  })
}
