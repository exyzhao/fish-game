/* Messages sent from the server to the client */

import { Player, PlayerId, Team } from '../models/players.js'
import { CardModel } from '../models/cards.js'

export enum ServerEvent {
  ERROR = 'ERROR',
  LOBBY_UPDATED = 'LOBBY_UPDATED',
  GAME_STARTED = 'GAME_STARTED',
  PRIVATE_PLAYER_HAND_UPDATE = 'PRIVATE_PLAYER_HAND_UPDATE',
  PLAYER_TURN = 'PLAYER_TURN',
  ASK_FOR_CARD_RESULT = 'ASK_FOR_CARD_RESULT',
}

export interface ServerEventMap {
  [ServerEvent.ERROR]: ErrorData
  [ServerEvent.LOBBY_UPDATED]: LobbyUpdatedData
  [ServerEvent.GAME_STARTED]: GameStartedData
  [ServerEvent.PRIVATE_PLAYER_HAND_UPDATE]: PlayerHandData
  [ServerEvent.PLAYER_TURN]: PlayerTurnData
  [ServerEvent.ASK_FOR_CARD_RESULT]: AskForCardResultData
}

export interface ErrorData {
  error: string
}

export interface LobbyUpdatedData {
  lobbyId: string
  lobbyPlayers: Player[]
}

export interface GameStartedData {
  teams: Record<PlayerId, Team>
  privatePlayerHand: CardModel[]
  currentTurnPlayerIndex: number
}

export interface PlayerHandData {
  hand: CardModel[]
}

export interface PlayerTurnData {
  playerId: PlayerId
}

export interface AskForCardResultData {
  targetPlayer: PlayerId
  askerPlayer: PlayerId
  card: CardModel
  success: boolean
}

export type ServerMessage = {
  [E in keyof ServerEventMap]: {
    event: E
    data: ServerEventMap[E]
  }
}[keyof ServerEventMap]
