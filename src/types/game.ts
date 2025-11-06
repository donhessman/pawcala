export type Player = 1 | 2;

export type PlayerType = 'dog' | 'cat';

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
