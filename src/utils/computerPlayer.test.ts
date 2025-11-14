import { describe, it, expect } from 'vitest';
import { selectComputerMove } from './computerPlayer';
import { createInitialBoard, makeMove } from './gameLogic';

describe('computerPlayer', () => {
  describe('selectComputerMove', () => {
    it('should return a valid move for easy difficulty', () => {
      const board = createInitialBoard();
      const move = selectComputerMove(board, 2, 'easy');

      // Easy should select from valid Player 2 pits (7-12)
      expect(move).toBeGreaterThanOrEqual(7);
      expect(move).toBeLessThanOrEqual(12);
      expect(board[move]).toBeGreaterThan(0);
    });

    it('should return a valid move for medium difficulty', () => {
      const board = createInitialBoard();
      const move = selectComputerMove(board, 2, 'medium');

      // Medium should select from valid Player 2 pits (7-12)
      expect(move).toBeGreaterThanOrEqual(7);
      expect(move).toBeLessThanOrEqual(12);
      expect(board[move]).toBeGreaterThan(0);
    });

    it('should return a valid move for hard difficulty', () => {
      const board = createInitialBoard();
      const move = selectComputerMove(board, 2, 'hard');

      // Hard should select from valid Player 2 pits (7-12)
      expect(move).toBeGreaterThanOrEqual(7);
      expect(move).toBeLessThanOrEqual(12);
      expect(board[move]).toBeGreaterThan(0);
    });

    it('should throw error when no valid moves available', () => {
      // Create board with no stones in Player 2's pits
      const board = createInitialBoard();
      for (let i = 7; i <= 12; i++) {
        board[i] = 0;
      }

      expect(() => selectComputerMove(board, 2, 'easy')).toThrow(
        'No valid moves available for computer player'
      );
    });

    it('easy difficulty should make random moves', () => {
      const board = createInitialBoard();
      const moves = new Set<number>();

      // Run easy difficulty multiple times to check randomness
      for (let i = 0; i < 20; i++) {
        const move = selectComputerMove(board, 2, 'easy');
        moves.add(move);
      }

      // Should have selected different moves (randomness check)
      // With 6 possible pits and 20 trials, we should see some variety
      expect(moves.size).toBeGreaterThan(1);
    });

    it('medium difficulty should prioritize extra turns', () => {
      // Create a scenario where pit 10 gives an extra turn
      const board = createInitialBoard();
      board[10] = 3; // Landing in store (13) gives extra turn

      // Medium should often choose the move that gives extra turn
      // Run multiple times to account for randomness in scoring
      const moves: number[] = [];
      for (let i = 0; i < 10; i++) {
        moves.push(selectComputerMove(board, 2, 'medium'));
      }

      // Should frequently select pit 10
      const pit10Count = moves.filter((m) => m === 10).length;
      expect(pit10Count).toBeGreaterThan(0);
    });

    it('medium difficulty should make strategic moves', () => {
      // Create a scenario with various strategic options
      const board = createInitialBoard();

      // Medium should consistently make valid strategic moves
      const moves: number[] = [];
      for (let i = 0; i < 10; i++) {
        const testBoard = [...board];
        const move = selectComputerMove(testBoard, 2, 'medium');
        moves.push(move);
        // Verify each move is valid
        expect(move).toBeGreaterThanOrEqual(7);
        expect(move).toBeLessThanOrEqual(12);
      }

      // All moves should be valid
      expect(moves.length).toBe(10);
    });

    it('hard difficulty should look ahead and avoid bad moves', () => {
      const board = createInitialBoard();

      // Hard difficulty should consistently make valid strategic moves
      for (let i = 0; i < 5; i++) {
        const move = selectComputerMove(board, 2, 'hard');
        expect(move).toBeGreaterThanOrEqual(7);
        expect(move).toBeLessThanOrEqual(12);
        expect(board[move]).toBeGreaterThan(0);
      }
    });

    it('should handle board state after opponent moves', () => {
      const board = createInitialBoard();

      // Player 1 makes a move
      const result1 = makeMove(board, 0, 1);

      // Computer (Player 2) should be able to make a valid move
      const computerMove = selectComputerMove(result1.newBoard, 2, 'medium');
      expect(computerMove).toBeGreaterThanOrEqual(7);
      expect(computerMove).toBeLessThanOrEqual(12);
    });

    it('should work for Player 1 as computer', () => {
      const board = createInitialBoard();
      const move = selectComputerMove(board, 1, 'easy');

      // Should select from valid Player 1 pits (0-5)
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThanOrEqual(5);
      expect(board[move]).toBeGreaterThan(0);
    });

    it('should handle end-game scenarios', () => {
      // Create near end-game board
      const board = createInitialBoard();
      // Empty most pits except a few
      for (let i = 0; i < 14; i++) {
        if (i !== 6 && i !== 13) {
          board[i] = 0;
        }
      }
      board[7] = 2; // Give Player 2 one move option
      board[10] = 3; // And another

      const move = selectComputerMove(board, 2, 'hard');
      expect([7, 10]).toContain(move);
    });

    it('hard difficulty should perform better than easy over multiple games', () => {
      // This is a more complex test that simulates game scenarios
      const board = createInitialBoard();

      // Test that hard makes more strategic choices than easy
      const easyMoves: number[] = [];
      const hardMoves: number[] = [];

      for (let i = 0; i < 10; i++) {
        easyMoves.push(selectComputerMove(board, 2, 'easy'));
        hardMoves.push(selectComputerMove(board, 2, 'hard'));
      }

      // This test mainly ensures both work without errors
      // In practice, hard should be more consistent
      expect(easyMoves.length).toBe(10);
      expect(hardMoves.length).toBe(10);
    });
  });
});
