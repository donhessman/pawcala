import { describe, it, expect } from 'vitest';
import {
  createInitialBoard,
  getPlayerPits,
  getPlayerStore,
  getOpponentStore,
  getOppositePit,
  isValidMove,
  makeMove,
  getGameStatus,
  INITIAL_STONES,
  PLAYER_1_STORE,
  PLAYER_2_STORE,
} from './gameLogic';

describe('gameLogic', () => {
  describe('createInitialBoard', () => {
    it('should create a board with 14 pits', () => {
      const board = createInitialBoard();
      expect(board).toHaveLength(14);
    });

    it('should initialize each regular pit with 4 stones', () => {
      const board = createInitialBoard();
      // Check player 1 pits (0-5)
      for (let i = 0; i <= 5; i++) {
        expect(board[i]).toBe(INITIAL_STONES);
      }
      // Check player 2 pits (7-12)
      for (let i = 7; i <= 12; i++) {
        expect(board[i]).toBe(INITIAL_STONES);
      }
    });

    it('should initialize stores with 0 stones', () => {
      const board = createInitialBoard();
      expect(board[PLAYER_1_STORE]).toBe(0);
      expect(board[PLAYER_2_STORE]).toBe(0);
    });
  });

  describe('getPlayerPits', () => {
    it('should return correct pits for player 1', () => {
      const pits = getPlayerPits(1);
      expect(pits).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it('should return correct pits for player 2', () => {
      const pits = getPlayerPits(2);
      expect(pits).toEqual([7, 8, 9, 10, 11, 12]);
    });
  });

  describe('getPlayerStore', () => {
    it('should return store index 6 for player 1', () => {
      expect(getPlayerStore(1)).toBe(6);
    });

    it('should return store index 13 for player 2', () => {
      expect(getPlayerStore(2)).toBe(13);
    });
  });

  describe('getOpponentStore', () => {
    it('should return player 2 store for player 1', () => {
      expect(getOpponentStore(1)).toBe(13);
    });

    it('should return player 1 store for player 2', () => {
      expect(getOpponentStore(2)).toBe(6);
    });
  });

  describe('getOppositePit', () => {
    it('should return correct opposite pit', () => {
      expect(getOppositePit(0)).toBe(12);
      expect(getOppositePit(1)).toBe(11);
      expect(getOppositePit(5)).toBe(7);
      expect(getOppositePit(7)).toBe(5);
      expect(getOppositePit(12)).toBe(0);
    });
  });

  describe('isValidMove', () => {
    it('should return false if pit does not belong to player', () => {
      const board = createInitialBoard();
      expect(isValidMove(board, 7, 1)).toBe(false); // pit 7 belongs to player 2
      expect(isValidMove(board, 0, 2)).toBe(false); // pit 0 belongs to player 1
    });

    it('should return false if pit is empty', () => {
      const board = createInitialBoard();
      board[0] = 0;
      expect(isValidMove(board, 0, 1)).toBe(false);
    });

    it('should return true for valid move', () => {
      const board = createInitialBoard();
      expect(isValidMove(board, 0, 1)).toBe(true);
      expect(isValidMove(board, 5, 1)).toBe(true);
      expect(isValidMove(board, 7, 2)).toBe(true);
      expect(isValidMove(board, 12, 2)).toBe(true);
    });
  });

  describe('makeMove', () => {
    it('should distribute stones counter-clockwise', () => {
      const board = createInitialBoard();
      const result = makeMove(board, 0, 1);

      // Starting pit should be empty
      expect(result.newBoard[0]).toBe(0);
      // Next 4 pits should have one more stone
      expect(result.newBoard[1]).toBe(5);
      expect(result.newBoard[2]).toBe(5);
      expect(result.newBoard[3]).toBe(5);
      expect(result.newBoard[4]).toBe(5);
    });

    it('should skip opponent store', () => {
      const board = createInitialBoard();
      board[5] = 8; // Enough stones to reach opponent's store
      const result = makeMove(board, 5, 1);

      // Opponent's store should not be incremented
      expect(result.newBoard[13]).toBe(0);
    });

    it('should grant extra turn when landing in own store', () => {
      const board = createInitialBoard();
      board[2] = 4; // Exactly reaches player 1's store at index 6
      const result = makeMove(board, 2, 1);

      expect(result.extraTurn).toBe(true);
      expect(result.newBoard[6]).toBe(1);
    });

    it('should capture stones when landing in empty pit on own side', () => {
      const board = createInitialBoard();
      board[0] = 1; // One stone to land in empty pit 1
      board[1] = 0; // Make pit 1 empty (where we'll land)
      board[11] = 3; // Opposite pit (to pit 1) has stones

      const result = makeMove(board, 0, 1);

      // Should capture the stone in pit 1 and stones in opposite pit (11)
      expect(result.capturedStones).toBe(4); // 1 from landing pit + 3 from opposite
      expect(result.newBoard[1]).toBe(0); // Landing pit emptied
      expect(result.newBoard[11]).toBe(0); // Opposite pit emptied
      expect(result.newBoard[6]).toBe(4); // Captured stones in player's store
    });

    it('should not capture if landing in own store', () => {
      const board = createInitialBoard();
      board[2] = 4;
      const result = makeMove(board, 2, 1);

      expect(result.capturedStones).toBe(0);
      expect(result.extraTurn).toBe(true);
    });

    it('should detect game over when one side is empty', () => {
      const board = createInitialBoard();
      // Empty player 1's pits
      for (let i = 0; i <= 5; i++) {
        board[i] = 0;
      }
      board[0] = 1; // One stone to make a move

      const result = makeMove(board, 0, 1);

      expect(result.gameOver).toBe(true);
    });

    it('should return distribution path', () => {
      const board = createInitialBoard();
      const result = makeMove(board, 0, 1);

      expect(result.distributionPath).toEqual([1, 2, 3, 4]);
    });
  });

  describe('getGameStatus', () => {
    it('should return current player turn message', () => {
      const gameState = {
        board: createInitialBoard(),
        currentPlayer: 1 as 1 | 2,
        player1Type: 'dog' as const,
        player2Type: 'cat' as const,
        gameOver: false,
        winner: null,
        lastMove: null,
      };

      expect(getGameStatus(gameState)).toBe("Dog's turn");
    });

    it('should return winner message when game is over', () => {
      const gameState = {
        board: createInitialBoard(),
        currentPlayer: 1 as 1 | 2,
        player1Type: 'dog' as const,
        player2Type: 'cat' as const,
        gameOver: true,
        winner: 1 as 1 | 2,
        lastMove: null,
      };

      expect(getGameStatus(gameState)).toBe('Dog wins!');
    });

    it('should return tie message when game ends in a tie', () => {
      const gameState = {
        board: createInitialBoard(),
        currentPlayer: 1 as 1 | 2,
        player1Type: 'dog' as const,
        player2Type: 'cat' as const,
        gameOver: true,
        winner: null,
        lastMove: null,
      };

      expect(getGameStatus(gameState)).toBe("It's a tie!");
    });
  });
});
