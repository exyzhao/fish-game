export interface Player {
  id: string
  name: string
}

export interface Lobby {
  lobbyId: string
  lobbyPlayers: Player[]
}
