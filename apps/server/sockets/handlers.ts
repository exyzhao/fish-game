import { WebSocket } from 'ws'
import crypto from 'crypto'

import { MyWebSocketServer, MyWebSocket } from '.'
import { Lobby } from '../models'
import { sendPrivateMessageToWs } from './sendingUtils'
import { JoinLobbyData } from '../../common/messages/clientMessages'
import { ServerEvent } from '../../common/messages/serverMessages'

const LOBBIES: Record<string, Lobby> = {}

export const handleJoinGame = (
  ws: MyWebSocket,
  data: JoinLobbyData,
  wss: MyWebSocketServer,
) => {
  const { lobbyId, playerName } = data

  if (!ws.playerId) {
    ws.playerId = crypto.randomUUID()
  }

  if (!lobbyId || !playerName) {
    sendPrivateMessageToWs(ws, {
      event: ServerEvent.ERROR,
      data: {
        error: 'Missing lobbyId or playerName',
      },
    })
    return
  }

  // If game doesn't exist, create it
  if (!LOBBIES[lobbyId]) {
    LOBBIES[lobbyId] = {
      lobbyId: lobbyId,
      lobbyPlayers: [],
    }
  }

  const lobby = LOBBIES[lobbyId]

  lobby.lobbyPlayers.push({
    id: ws.playerId,
    name: playerName,
  })

  sendPrivateMessageToWs(ws, {
    event: ServerEvent.JOIN_LOBBY_RESPONSE,
    data: {
      lobbyId: lobbyId,
      success: true,
    },
  })
}
