import { Card } from '../models'

export enum ClientEvent {
  JOIN_LOBBY = 'JOIN_LOBBY',
  LEAVE_LOBBY = 'LEAVE_LOBBY',
  READY_UP = 'READY_UP',
  DISCONNECT_GAME = 'DISCONNECT_GAME',
  ASK_FOR_CARD = 'ASK_FOR_CARD',
  DECLARE_FISH = 'DECLARE_FISH',
  DECLARE_COUNTERFISH = 'DECLARE_COUNTERFISH',
}

export interface ClientEventMap {
  [ClientEvent.JOIN_LOBBY]: JoinLobbyData
  [ClientEvent.LEAVE_LOBBY]: {}
  [ClientEvent.READY_UP]: {}
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
  card: Card
}

export interface DeclareFishData {
  [playerId: string]: Card[]
}

export type ClientMessage = {
  [E in keyof ClientEventMap]: {
    event: E
    data: ClientEventMap[E]
  }
}[keyof ClientEventMap]
