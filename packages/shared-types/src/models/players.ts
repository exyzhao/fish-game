export type PlayerId = string

export interface Player {
  id: PlayerId
  name: string
}

// TODO: generate random fun team names
// TODO: generate random fun profile pictures
export enum Team {
  RED = 'RED',
  BLUE = 'BLUE',
}
