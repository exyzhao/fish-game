import * as R from 'remeda'

import { Game, Lobby } from './models'
import { Suit, Rank, CardModel, HalfSuit, CardType } from '@repo/shared-types'
import { PlayerId, Player, Team } from '@repo/shared-types'

const createDeck = (): CardModel[] => {
  const standardCards: CardModel[] = Object.values(Suit).flatMap((suit) =>
    Object.values(Rank).map((rank) => ({
      type: CardType.Standard,
      suit,
      rank,
    })),
  )

  const jokerCards: CardModel[] = [
    { type: CardType.Joker, color: 'red' },
    { type: CardType.Joker, color: 'black' },
  ]

  return R.concat(standardCards, jokerCards)
}

const createTeams = (players: Player[]): Record<PlayerId, Team> => {
  const shuffledPlayers = R.shuffle(players)
  const teamAssignments = R.concat(
    R.times(players.length / 2, (_) => Team.RED),
    R.times(players.length / 2, (_) => Team.BLUE),
  )
  const teams: [PlayerId, Team][] = R.zip(
    shuffledPlayers.map((player) => player.id),
    teamAssignments,
  )
  return R.fromEntries(teams)
}

const createStartingPlayerHands = (
  players: Player[],
): Record<PlayerId, CardModel[]> => {
  const deck: CardModel[] = createDeck()
  const shuffledDeck = R.shuffle(deck)

  const numPlayers = players.length
  const numCardsPerPlayer = Math.floor(shuffledDeck.length / numPlayers)
  const chunkedDeck: CardModel[][] = R.chunk(shuffledDeck, numCardsPerPlayer)
  const playerHandsPairs: [PlayerId, CardModel[]][] = R.zip(
    players.map((player) => player.id),
    chunkedDeck,
  )
  const playerHands = R.fromEntries(playerHandsPairs)

  return playerHands
}

const halfSuitOfCard = (card: CardModel): HalfSuit => {
  if (card.type === CardType.Joker || card.rank === '7') {
    return { type: 'sevensAndJokers' }
  }

  const lowerOrUpper = '2' <= card.rank && card.rank <= '6' ? 'lower' : 'upper'

  return { type: 'standard', suit: card.suit, lowerOrUpper }
}

const isInHalfSuit = (card: CardModel, halfSuit: HalfSuit): boolean => {
  return halfSuit === halfSuitOfCard(card)
}

const playerHasCards = (playerId: PlayerId, game: Game): boolean => {
  return game.playerHands[playerId].length > 0
}

/* Functions that don't modify state */

export const checkIfPlayerHasCard = (
  playerId: PlayerId,
  card: CardModel,
  game: Game,
) => {
  return game.playerHands[playerId].includes(card)
}

export const getCurrentTurnPlayer = (game: Game) => {
  return game.gamePlayers[game.currentTurnPlayerIndex]
}

// export const canAskForCard = (
//   playerId: PlayerId,
//   game: Game,
//   card: CardModel,
// ) => {
//   let targetHalfSuit =

//   for (const card of game.playerHands[playerId]) {
//     if (isInHalfSuit(card, targetHalfSuit)) {
//       return true
//     }
//   }
//   return false
// }

/* Create a new game, doesn't modify state */

export const createNewGameFromLobby = (lobby: Lobby): Game => {
  const playerHands = createStartingPlayerHands(lobby.lobbyPlayers)
  const playerTeams = createTeams(lobby.lobbyPlayers)

  const randomPlayerIndex = Math.floor(
    Math.random() * lobby.lobbyPlayers.length,
  )

  return {
    lobbyId: lobby.lobbyId,
    gamePlayers: lobby.lobbyPlayers,
    playerHands,
    playerTeams,
    currentTurnPlayerIndex: randomPlayerIndex,
  }
}

/* Functions that mutate the game state */

export const giveCardFromOnePlayerToAnother = (
  targetPlayer: PlayerId,
  askerPlayer: PlayerId,
  card: CardModel,
  game: Game,
) => {
  game.playerHands[askerPlayer].push(card)
  game.playerHands[targetPlayer].splice(
    game.playerHands[targetPlayer].indexOf(card),
    1,
  )
}

export const updateCurrentTurnPlayerIndex = (game: Game) => {
  let nextTurnPlayerIndex = game.currentTurnPlayerIndex

  while (!playerHasCards(game.gamePlayers[nextTurnPlayerIndex].id, game)) {
    nextTurnPlayerIndex += 1
    if (nextTurnPlayerIndex >= game.gamePlayers.length) {
      nextTurnPlayerIndex = 0
    }
  }

  game.currentTurnPlayerIndex = nextTurnPlayerIndex
}

export const removeHalfSuitFromGame = (halfSuit: HalfSuit, game: Game) => {
  for (const playerId in game.playerHands) {
    game.playerHands[playerId] = game.playerHands[playerId].filter(
      (card) => !isInHalfSuit(card, halfSuit),
    )
  }
}
