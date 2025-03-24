import { CardModel } from '@repo/shared-types'
import { Player, PlayerId, Team } from '@repo/shared-types'

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
