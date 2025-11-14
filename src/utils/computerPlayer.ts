import { Player } from '@/types/game';
import {
  getPlayerPits,
  getPlayerStore,
  isValidMove,
  makeMove,
  getOpponentStore,
} from './gameLogic';

export type ComputerDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Selects a move for the computer player based on difficulty level
 */
export function selectComputerMove(
  board: number[],
  player: Player,
  difficulty: ComputerDifficulty
): number {
  const validMoves = getValidMoves(board, player);

  if (validMoves.length === 0) {
    throw new Error('No valid moves available for computer player');
  }

  switch (difficulty) {
    case 'easy':
      return selectRandomMove(validMoves);
    case 'medium':
      return selectMediumMove(board, player, validMoves);
    case 'hard':
      return selectHardMove(board, player, validMoves);
    default:
      return selectRandomMove(validMoves);
  }
}

/**
 * Get all valid pit indices for a player
 */
function getValidMoves(board: number[], player: Player): number[] {
  const playerPits = getPlayerPits(player);
  return playerPits.filter((pitIndex) => isValidMove(board, pitIndex, player));
}

/**
 * Easy: Random move selection
 */
function selectRandomMove(validMoves: number[]): number {
  const randomIndex = Math.floor(Math.random() * validMoves.length);
  return validMoves[randomIndex];
}

/**
 * Medium: Heuristic-based move selection
 * Prioritizes: extra turns > captures > maximizing stones in store
 */
function selectMediumMove(board: number[], player: Player, validMoves: number[]): number {
  let bestMove = validMoves[0];
  let bestScore = -Infinity;

  for (const move of validMoves) {
    const result = makeMove(board, move, player);
    let score = 0;

    // Prioritize extra turns (very valuable)
    if (result.extraTurn) {
      score += 100;
    }

    // Prioritize captures
    if (result.capturedStones > 0) {
      score += result.capturedStones * 10;
    }

    // Prefer moves that put more stones in our store
    const playerStore = getPlayerStore(player);
    const stoneGain = result.newBoard[playerStore] - board[playerStore];
    score += stoneGain * 5;

    // Add some randomness to avoid predictability (±10 points)
    score += Math.random() * 20 - 10;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Hard: Minimax algorithm with alpha-beta pruning
 * Looks ahead 3-4 moves to find optimal strategy
 */
function selectHardMove(board: number[], player: Player, validMoves: number[]): number {
  const depth = 4; // Look ahead 4 plies (2 full turns)
  let bestMove = validMoves[0];
  let bestScore = -Infinity;

  for (const move of validMoves) {
    const result = makeMove(board, move, player);

    // If extra turn, it's still our turn in the recursion
    const nextPlayer = result.extraTurn ? player : player === 1 ? 2 : 1;

    const score = minimax(result.newBoard, depth - 1, -Infinity, Infinity, nextPlayer, player);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Minimax algorithm with alpha-beta pruning
 */
function minimax(
  board: number[],
  depth: number,
  alpha: number,
  beta: number,
  currentPlayer: Player,
  maximizingPlayer: Player
): number {
  // Base case: reached depth limit or game over
  if (depth === 0) {
    return evaluateBoard(board, maximizingPlayer);
  }

  const validMoves = getValidMoves(board, currentPlayer);

  // Game over - no valid moves
  if (validMoves.length === 0) {
    return evaluateBoard(board, maximizingPlayer);
  }

  // Maximizing player's turn (computer)
  if (currentPlayer === maximizingPlayer) {
    let maxScore = -Infinity;

    for (const move of validMoves) {
      const result = makeMove(board, move, currentPlayer);
      const nextPlayer = result.extraTurn ? currentPlayer : currentPlayer === 1 ? 2 : 1;

      const score = minimax(result.newBoard, depth - 1, alpha, beta, nextPlayer, maximizingPlayer);

      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);

      // Alpha-beta pruning
      if (beta <= alpha) {
        break;
      }
    }

    return maxScore;
  } else {
    // Minimizing player's turn (opponent)
    let minScore = Infinity;

    for (const move of validMoves) {
      const result = makeMove(board, move, currentPlayer);
      const nextPlayer = result.extraTurn ? currentPlayer : currentPlayer === 1 ? 2 : 1;

      const score = minimax(result.newBoard, depth - 1, alpha, beta, nextPlayer, maximizingPlayer);

      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);

      // Alpha-beta pruning
      if (beta <= alpha) {
        break;
      }
    }

    return minScore;
  }
}

/**
 * Evaluates the board state for a player
 * Higher score = better for the player
 */
function evaluateBoard(board: number[], player: Player): number {
  const opponent = player === 1 ? 2 : 1;
  const playerStore = getPlayerStore(player);
  const opponentStore = getOpponentStore(player);

  // Primary: difference in store counts
  let score = board[playerStore] - board[opponentStore];

  // Secondary: difference in total stones on each side
  const playerPits = getPlayerPits(player);
  const opponentPits = getPlayerPits(opponent);

  const playerPitStones = playerPits.reduce((sum, pit) => sum + board[pit], 0);
  const opponentPitStones = opponentPits.reduce((sum, pit) => sum + board[pit], 0);

  // Stones in pits are worth less than stones in store
  score += (playerPitStones - opponentPitStones) * 0.5;

  return score;
}
