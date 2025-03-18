export enum ServerEvent {
  ERROR = 'ERROR',
  JOIN_LOBBY_RESPONSE = 'JOIN_LOBBY_RESPONSE',
}

export interface ServerEventMap {
  [ServerEvent.JOIN_LOBBY_RESPONSE]: JoinLobbyResponseData
  [ServerEvent.ERROR]: ErrorData
}

export interface ErrorData {
  error: string
}

export interface JoinLobbyResponseData {
  lobbyId: string
  success: boolean
}

export type ServerMessage = {
  [E in keyof ServerEventMap]: {
    event: E
    data: ServerEventMap[E]
  }
}[keyof ServerEventMap]
