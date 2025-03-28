import { CardModel } from '../models/cards.js'

export enum ClientEvent {
  JOIN_LOBBY = 'JOIN_LOBBY',
  LEAVE_LOBBY = 'LEAVE_LOBBY',
  HOST_START_GAME = 'HOST_START_GAME',
  DISCONNECT_GAME = 'DISCONNECT_GAME',
  ASK_FOR_CARD = 'ASK_FOR_CARD',
  DECLARE_FISH = 'DECLARE_FISH',
  DECLARE_COUNTERFISH = 'DECLARE_COUNTERFISH',
}

export interface ClientEventMap {
  [ClientEvent.JOIN_LOBBY]: JoinLobbyData
  [ClientEvent.LEAVE_LOBBY]: {}
  [ClientEvent.HOST_START_GAME]: {}
  [ClientEvent.DISCONNECT_GAME]: {}
  [ClientEvent.ASK_FOR_CARD]: AskForCardData
  [ClientEvent.DECLARE_FISH]: DeclareFishData
  [ClientEvent.DECLARE_COUNTERFISH]: DeclareFishData
}

export interface JoinLobbyData {
  lobbyId: string
  playerName: string
}

export interface AskForCardData {
  playerId: string
  card: CardModel
}

export interface DeclareFishData {
  [playerId: string]: CardModel[]
}

export type ClientMessage = {
  [E in keyof ClientEventMap]: {
    event: E
    data: ClientEventMap[E]
  }
}[keyof ClientEventMap]
