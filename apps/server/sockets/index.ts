import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import { handleJoinGame } from './handlers'

interface MyWebSocket extends WebSocket {
  gameId?: string
  playerId?: string
}

interface MyWebSocketServer extends WebSocketServer {
  clients: Set<MyWebSocket>
}

export const initWebSockets = (server: import('http').Server) => {
  const wss = new WebSocketServer({ server }) as MyWebSocketServer

  wss.on('connection', (ws: MyWebSocket, req: IncomingMessage) => {
    console.log('Client connected')

    ws.on('message', (msg: string) => {
      let data: any
      try {
        data = JSON.parse(msg)
      } catch (e) {
        ws.send(JSON.stringify({ error: 'Invalid JSON' }))
        return
      }

      switch (data.event) {
        case 'JOIN_GAME':
          handleJoinGame(ws, data, wss)
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
