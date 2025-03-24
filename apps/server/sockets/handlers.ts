import crypto from 'crypto'

import { PlayerId, ServerEvent } from '@repo/shared-types'
import { AskForCardData, JoinLobbyData } from '@repo/shared-types'

import { MyWebSocketServer, MyWebSocket } from '.'
import { Game, Lobby, LobbyId } from '../models'
import {
  broadcastToLobby,
  sendErrorToWs,
  sendPrivateMessage,
  sendPrivateMessageToWs,
} from './sendingUtils'
import {
  checkIfPlayerHasCard,
  createNewGameFromLobby,
  getCurrentTurnPlayer,
  giveCardFromOnePlayerToAnother,
} from '../gameUtils'

const ALLOWED_PLAYERS_PER_GAME = 6

const LOBBIES: Record<LobbyId, Lobby> = {}
const GAMES: Record<LobbyId, Game> = {}

const getLobbyOfPlayer = (playerId: PlayerId) => {
  return Object.values(LOBBIES).find((lobby) =>
    lobby.lobbyPlayers.some((player) => player.id === playerId),
  )
}

export const handleJoinLobby = (
  ws: MyWebSocket,
  data: JoinLobbyData,
  wss: MyWebSocketServer,
) => {
  const { lobbyId, playerName } = data

  if (!ws.playerId) {
    ws.playerId = crypto.randomUUID()
  }

  if (!lobbyId || !playerName) {
    sendErrorToWs(ws, 'Missing lobbyId or playerName')
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

  if (lobby.lobbyPlayers.length >= ALLOWED_PLAYERS_PER_GAME) {
    sendErrorToWs(ws, 'Lobby is full, unable to join')
    return
  }

  lobby.lobbyPlayers.push({
    id: ws.playerId,
    name: playerName,
  })

  broadcastToLobby(wss, lobbyId, {
    event: ServerEvent.LOBBY_UPDATED,
    data: {
      lobbyId: lobbyId,
      lobbyPlayers: lobby.lobbyPlayers,
    },
  })
}

export const handleLeaveLobby = (
  ws: MyWebSocket,
  data: {},
  wss: MyWebSocketServer,
) => {
  if (!ws.playerId) {
    return
  }

  const lobby = getLobbyOfPlayer(ws.playerId)
  if (!lobby) {
    return
  }

  // Remove the player from the lobby
  lobby.lobbyPlayers = lobby.lobbyPlayers.filter(
    (player) => player.id !== ws.playerId,
  )

  if (lobby.lobbyPlayers.length === 0) {
    delete LOBBIES[lobby.lobbyId]
  }
}

export const handleHostStartGame = (
  ws: MyWebSocket,
  data: {},
  wss: MyWebSocketServer,
) => {
  if (!ws.playerId) {
    return
  }

  const lobby = getLobbyOfPlayer(ws.playerId)
  if (!lobby) {
    return
  }

  if (lobby.lobbyPlayers[0].id !== ws.playerId) {
    sendErrorToWs(ws, 'Cannot start game, you are not the host')
    return
  }

  if (lobby.lobbyPlayers.length != ALLOWED_PLAYERS_PER_GAME) {
    sendErrorToWs(ws, 'Cannot start game, need exactly 6 players')
    return
  }

  const game: Game = createNewGameFromLobby(lobby)
  GAMES[lobby.lobbyId] = game

  for (const playerId of game.gamePlayers.map((player) => player.id)) {
    broadcastToLobby(wss, lobby.lobbyId, {
      event: ServerEvent.GAME_STARTED,
      data: {
        teams: game.playerTeams,
        privatePlayerHand: game.playerHands[playerId],
        currentTurnPlayerIndex: game.currentTurnPlayerIndex,
      },
    })
  }
}

export const handleAskForCard = (
  ws: MyWebSocket,
  data: AskForCardData,
  wss: MyWebSocketServer,
) => {
  if (!ws.playerId || !ws.lobbyId) {
    return
  }

  const game = GAMES[ws.lobbyId]
  if (!game) {
    return
  }

  if (getCurrentTurnPlayer(game).id !== ws.playerId) {
    sendErrorToWs(ws, 'Cannot ask for card, it is not your turn')
    return
  }

  const askerPlayer = ws.playerId
  const { playerId: targetPlayer, card } = data

  const success = checkIfPlayerHasCard(targetPlayer, card, game)

  broadcastToLobby(wss, ws.lobbyId, {
    event: ServerEvent.ASK_FOR_CARD_RESULT,
    data: {
      targetPlayer,
      askerPlayer,
      card,
      success,
    },
  })

  if (success) {
    giveCardFromOnePlayerToAnother(targetPlayer, askerPlayer, card, game)

    sendPrivateMessageToWs(ws, {
      event: ServerEvent.PRIVATE_PLAYER_HAND_UPDATE,
      data: {
        hand: game.playerHands[ws.playerId],
      },
    })

    sendPrivateMessage(wss, targetPlayer, {
      event: ServerEvent.PRIVATE_PLAYER_HAND_UPDATE,
      data: {
        hand: game.playerHands[targetPlayer],
      },
    })
  }
}
