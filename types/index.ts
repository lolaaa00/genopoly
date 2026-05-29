export type GameStatus = "waiting" | "active" | "completed" | "cancelled" | "disputed";
export type SpaceType = "start" | "property" | "transit" | "utility" | "tax" | "market_event" | "city_event" | "lockup" | "go_to_lockup" | "rest" | "fee";
export type PendingActionType = "none" | "buy_or_auction" | "auction" | "debt_resolution" | "lockup_decision";
export type PlayerStatus = "active" | "bankrupt" | "resigned";
export type DistrictName = "Ember" | "Jade" | "Coral" | "Harbor" | "Ivory" | "Neon" | "Obsidian" | "Crown" | "Transit" | "Utility" | null;

export interface BoardSpace {
  id: number;
  name: string;
  type: SpaceType;
  district: DistrictName;
  price?: number;
  baseRent?: number;
  rentLevels?: number[];
  mortgageValue?: number;
  upgradeColor?: string;
}

export interface DiceRoll {
  die1: number;
  die2: number;
  total: number;
  isDoubles: boolean;
  moveNumber: number;
  player: string;
  timestamp: number;
}

export interface PlayerState {
  wallet: string;
  username?: string;
  balance: number;
  position: number;
  status: PlayerStatus;
  inLockup: boolean;
  lockupTurns: number;
  releaseCards: number;
  doublesCount: number;
  properties: number[];
  totalRentCollected: number;
  totalRentPaid: number;
  bankruptAt?: number;
}

export interface PropertyState {
  spaceId: number;
  owner: string | null;
  upgradeLevel: number;
  mortgaged: boolean;
  district: DistrictName;
  districtComplete: boolean;
}

export interface AuctionState {
  active: boolean;
  spaceId: number;
  highestBid: number;
  highestBidder: string | null;
  participants: string[];
  passedPlayers: string[];
  round: number;
}

export interface TradeOffer {
  id: string;
  fromPlayer: string;
  toPlayer: string;
  offeredCash: number;
  requestedCash: number;
  offeredProperties: number[];
  requestedProperties: number[];
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: number;
}

export interface MoveHistoryItem {
  moveNumber: number;
  player: string;
  action: string;
  details: Record<string, unknown>;
  timestamp: number;
  txHash?: string;
}

export interface EventHistoryItem {
  moveNumber: number;
  player: string;
  eventType: "market_event" | "city_event";
  cardText: string;
  effect: Record<string, unknown>;
  timestamp: number;
}

export interface GameState {
  gameId: string;
  status: GameStatus;
  players: PlayerState[];
  properties: Record<number, PropertyState>;
  currentPlayerIndex: number;
  turnNumber: number;
  pendingAction: PendingActionType;
  pendingActionData: Record<string, unknown>;
  auction: AuctionState | null;
  tradeOffers: TradeOffer[];
  lastDiceRoll: DiceRoll | null;
  winner: string | null;
  maxPlayers: number;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

export interface LeaderboardRow {
  wallet: string;
  username?: string;
  wins: number;
  losses: number;
  bankruptcies: number;
  totalNetWorth: number;
  totalRentCollected: number;
  auctionsWon: number;
  tradesCompleted: number;
  fairPlayScore: number;
  gamesPlayed: number;
}

export interface Room {
  id: string;
  creatorWallet: string;
  genlayerGameId: string;
  maxPlayers: number;
  isPublic: boolean;
  status: "waiting" | "active" | "completed" | "cancelled";
  createdAt: string;
  playerCount: number;
}

export interface RoomPlayer {
  roomId: string;
  wallet: string;
  username?: string;
  isReady: boolean;
  joinedAt: string;
  playerIndex: number;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  wallet: string;
  username?: string;
  message: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  wallet: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface GameHistoryItem {
  id: string;
  genlayerGameId: string;
  players: string[];
  winner: string | null;
  moveCount: number;
  status: GameStatus;
  createdAt: string;
  completedAt?: string;
}
