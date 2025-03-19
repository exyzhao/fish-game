import { CardModel } from '@repo/shared-types/models/cards'
import { PlayerId, Player } from '@repo/shared-types/models/players'

export type LobbyId = string

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
