import { Player, MoveResult, GameState } from '@/types/game';

// Board layout:
// Indices:  12  11  10   9   8   7
//        13                         6  <- Stores
//           0   1   2   3   4   5
// Player 2's pits: 7-12, store: 13
// Player 1's pits: 0-5, store: 6

export const INITIAL_STONES = 4;
export const PITS_PER_PLAYER = 6;
export const PLAYER_1_PITS = [0, 1, 2, 3, 4, 5];
export const PLAYER_2_PITS = [7, 8, 9, 10, 11, 12];
export const PLAYER_1_STORE = 6;
export const PLAYER_2_STORE = 13;

export function createInitialBoard(): number[] {
  // Create board with 4 stones in each pit, 0 in stores
  const board = new Array(14).fill(INITIAL_STONES);
  board[PLAYER_1_STORE] = 0;
  board[PLAYER_2_STORE] = 0;
  return board;
}

export function getPlayerPits(player: Player): number[] {
  return player === 1 ? PLAYER_1_PITS : PLAYER_2_PITS;
}

export function getPlayerStore(player: Player): number {
  return player === 1 ? PLAYER_1_STORE : PLAYER_2_STORE;
}

export function getOpponentStore(player: Player): number {
  return player === 1 ? PLAYER_2_STORE : PLAYER_1_STORE;
}

export function getOppositePit(pitIndex: number): number {
  // Opposite pit formula: 12 - pitIndex
  return 12 - pitIndex;
}

export function isValidMove(board: number[], pitIndex: number, player: Player): boolean {
  const playerPits = getPlayerPits(player);

  // Check if pit belongs to current player
  if (!playerPits.includes(pitIndex)) {
    return false;
  }

  // Check if pit has stones
  if (board[pitIndex] === 0) {
    return false;
  }

  return true;
}

export function makeMove(board: number[], pitIndex: number, player: Player): MoveResult {
  const newBoard = [...board];
  let stones = newBoard[pitIndex];
  newBoard[pitIndex] = 0;

  let currentIndex = pitIndex;
  const opponentStore = getOpponentStore(player);
  const playerStore = getPlayerStore(player);
  const distributionPath: number[] = [];

  // Distribute stones counter-clockwise
  while (stones > 0) {
    currentIndex = (currentIndex + 1) % 14;

    // Skip opponent's store
    if (currentIndex === opponentStore) {
      continue;
    }

    newBoard[currentIndex]++;
    distributionPath.push(currentIndex);
    stones--;
  }

  // Check for capture: landed in empty pit on player's side
  const playerPits = getPlayerPits(player);
  let capturedStones = 0;

  if (
    playerPits.includes(currentIndex) &&
    newBoard[currentIndex] === 1 &&
    currentIndex !== playerStore
  ) {
    const oppositePit = getOppositePit(currentIndex);
    const oppositeStones = newBoard[oppositePit];

    if (oppositeStones > 0) {
      capturedStones = oppositeStones + 1;
      newBoard[playerStore] += capturedStones;
      newBoard[currentIndex] = 0;
      newBoard[oppositePit] = 0;
    }
  }

  // Check for extra turn: landed in player's store
  const extraTurn = currentIndex === playerStore;

  // Check for game over
  const player1Empty = PLAYER_1_PITS.every((pit) => newBoard[pit] === 0);
  const player2Empty = PLAYER_2_PITS.every((pit) => newBoard[pit] === 0);
  const gameOver = player1Empty || player2Empty;

  let winner: Player | null = null;

  if (gameOver) {
    // Collect remaining stones
    if (player1Empty) {
      const remaining = PLAYER_2_PITS.reduce((sum, pit) => sum + newBoard[pit], 0);
      newBoard[PLAYER_2_STORE] += remaining;
      PLAYER_2_PITS.forEach((pit) => (newBoard[pit] = 0));
    } else {
      const remaining = PLAYER_1_PITS.reduce((sum, pit) => sum + newBoard[pit], 0);
      newBoard[PLAYER_1_STORE] += remaining;
      PLAYER_1_PITS.forEach((pit) => (newBoard[pit] = 0));
    }

    // Determine winner
    if (newBoard[PLAYER_1_STORE] > newBoard[PLAYER_2_STORE]) {
      winner = 1;
    } else if (newBoard[PLAYER_2_STORE] > newBoard[PLAYER_1_STORE]) {
      winner = 2;
    }
  }

  return {
    newBoard,
    capturedStones,
    extraTurn,
    gameOver,
    winner,
    distributionPath,
  };
}

export function getGameStatus(state: GameState): string {
  if (state.gameOver) {
    if (state.winner === null) {
      return "It's a tie!";
    }
    const winnerType = state.winner === 1 ? state.player1Type : state.player2Type;
    return `${winnerType === 'dog' ? 'Dog' : 'Cat'} wins!`;
  }

  const currentType = state.currentPlayer === 1 ? state.player1Type : state.player2Type;
  return `${currentType === 'dog' ? 'Dog' : 'Cat'}'s turn`;
}
