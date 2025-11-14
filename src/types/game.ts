export type Player = 1 | 2;

export type PlayerType = 'dog' | 'cat';

export type ComputerDifficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  board: number[]; // 14 positions: [P2-pits (6), P2-store, P1-pits (6), P1-store]
  currentPlayer: Player;
  player1Type: PlayerType;
  player2Type: PlayerType;
  gameOver: boolean;
  winner: Player | null;
  lastMove: {
    pitIndex: number;
    player: Player;
  } | null;
  computerPlayer?: Player; // Which player is computer-controlled (if any)
  computerDifficulty?: ComputerDifficulty; // Difficulty level for computer player
}

export interface AnimationState {
  isAnimating: boolean;
  currentPit: number | null;
  pawType: PlayerType | null;
  stones: number[];
}

export interface PitProps {
  index: number;
  stones: number;
  isStore: boolean;
  player: Player;
  isClickable: boolean;
  onClick: () => void;
  isHighlighted?: boolean;
  isAnimating?: boolean;
}

export interface MoveResult {
  newBoard: number[];
  capturedStones: number;
  extraTurn: boolean;
  gameOver: boolean;
  winner: Player | null;
  distributionPath: number[]; // Path of pits that received stones
}

export interface GameNotification {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

// Multiplayer extensions
export interface PlayerInfo {
  id: string;
  name: string;
  type: PlayerType;
  online: boolean;
  lastSeen: string;
}

export interface MultiplayerGameState extends GameState {
  roomId: string;
  localPlayerNumber: Player | null;
  players: {
    player1: PlayerInfo | null;
    player2: PlayerInfo | null;
  };
  createdAt: string;
}

export interface BroadcastMovePayload {
  type: 'move';
  pitIndex: number;
  player: Player;
  moveResult: MoveResult;
  timestamp: string;
}

export interface StateRequestPayload {
  type: 'state_request';
  requesterId: string;
  timestamp: string;
}

export interface StateSyncPayload {
  type: 'state_sync';
  gameState: {
    board: number[];
    currentPlayer: Player;
    gameOver: boolean;
    winner: Player | null;
  };
  timestamp: string;
}
