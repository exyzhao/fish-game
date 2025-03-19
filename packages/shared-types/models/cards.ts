export enum CardType {
  Standard = 'standard',
  Joker = 'joker',
}

export enum Suit {
  HEARTS = 'HEARTS',
  DIAMONDS = 'DIAMONDS',
  CLUBS = 'CLUBS',
  SPADES = 'SPADES',
}

export enum Rank {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',

  EIGHT = '8',

  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
  ACE = 'A',
}

export interface StandardCardModel {
  type: CardType.Standard
  suit: Suit
  rank: Rank
}

export interface JokerCardModel {
  type: CardType.Joker
  color: 'red' | 'black'
}

export type CardModel = StandardCardModel | JokerCardModel

export interface StandardHalfSuit {
  type: 'standard'
  suit: Suit
  lowerOrUpper: 'lower' | 'upper'
}

export interface JokerHalfSuit {
  type: 'sevensAndJokers'
}

export type HalfSuit = StandardHalfSuit | JokerHalfSuit
