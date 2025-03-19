import { CardModel } from '@repo/shared-types/models/cards'
import { PlayerId, Player } from '@repo/shared-types/models/players'

export type LobbyId = string

// TODO: generate random fun team names
// TODO: generate random fun profile pictures
export enum Team {
  RED = 'RED',
  BLUE = 'BLUE',
}

export interface Lobby {
  lobbyId: LobbyId
  lobbyPlayers: Player[]
}

export interface Game {
  lobbyId: LobbyId
  gamePlayers: Player[]
  playerHands: Record<PlayerId, CardModel[]>
  playerTeams: Record<PlayerId, Team>
  currentTurnPlayerIndex: number
}
