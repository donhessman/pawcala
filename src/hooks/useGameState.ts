'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameState, Player, GameNotification, ComputerDifficulty } from '@/types/game';
import { createInitialBoard, makeMove, isValidMove, getPlayerStore } from '@/utils/gameLogic';
import { selectComputerMove } from '@/utils/computerPlayer';

export function useGameState(
  initialComputerPlayer?: Player,
  initialComputerDifficulty?: ComputerDifficulty
) {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createInitialBoard(),
    currentPlayer: 1,
    player1Type: 'dog',
    player2Type: 'cat',
    gameOver: false,
    winner: null,
    lastMove: null,
    computerPlayer: initialComputerPlayer,
    computerDifficulty: initialComputerDifficulty,
  }));

  // Update computer settings when they change
  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      computerPlayer: initialComputerPlayer,
      computerDifficulty: initialComputerDifficulty,
    }));
  }, [initialComputerPlayer, initialComputerDifficulty]);

  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingPit, setAnimatingPit] = useState<number | null>(null);
  const [notification, setNotification] = useState<GameNotification | null>(null);

  const handleMove = useCallback(
    (pitIndex: number) => {
      if (isAnimating || gameState.gameOver) {
        return;
      }

      if (!isValidMove(gameState.board, pitIndex, gameState.currentPlayer)) {
        return;
      }

      setIsAnimating(true);
      const result = makeMove(gameState.board, pitIndex, gameState.currentPlayer);

      // Immediately set the animating pit to show the paw sliding in
      setAnimatingPit(pitIndex);

      // After 800ms slide-in animation, empty the clicked pit and pause
      setTimeout(() => {
        setGameState((prev) => {
          const newBoard = [...prev.board];
          newBoard[pitIndex] = 0;
          return { ...prev, board: newBoard };
        });

        // Wait 200ms pause at the clicked pit before starting distribution
        setTimeout(() => {
          // Distribute stones sequentially
          const initialBoard = [...gameState.board];
          initialBoard[pitIndex] = 0;

          result.distributionPath.forEach((pit, index) => {
            setTimeout(() => {
              setAnimatingPit(pit);
              initialBoard[pit]++;

              setGameState((prev) => ({
                ...prev,
                board: [...initialBoard],
              }));

              // On last stone
              if (index === result.distributionPath.length - 1) {
                setTimeout(() => {
                  setAnimatingPit(null);

                  // Show notifications for special events
                  if (result.capturedStones > 0) {
                    const playerType =
                      gameState.currentPlayer === 1 ? gameState.player1Type : gameState.player2Type;
                    setNotification({
                      message: `${playerType === 'dog' ? '🐕' : '🐈'} Captured ${result.capturedStones} stones!`,
                      severity: 'success',
                    });
                  } else if (result.extraTurn) {
                    const playerType =
                      gameState.currentPlayer === 1 ? gameState.player1Type : gameState.player2Type;
                    setNotification({
                      message: `${playerType === 'dog' ? '🐕' : '🐈'} Gets another turn!`,
                      severity: 'info',
                    });
                  }

                  setGameState((prev) => ({
                    ...prev,
                    board: result.newBoard,
                    currentPlayer: result.extraTurn
                      ? prev.currentPlayer
                      : prev.currentPlayer === 1
                        ? 2
                        : 1,
                    gameOver: result.gameOver,
                    winner: result.winner,
                    lastMove: {
                      pitIndex,
                      player: prev.currentPlayer,
                    },
                  }));

                  setIsAnimating(false);
                }, 400);
              }
            }, index * 400);
          });
        }, 200); // Brief pause at the clicked pit before distributing
      }, 800); // Wait 800ms for the slide-in animation
    },
    [gameState, isAnimating]
  );

  // Handle computer moves
  useEffect(() => {
    // Check if it's the computer's turn
    if (
      !isAnimating &&
      !gameState.gameOver &&
      gameState.computerPlayer === gameState.currentPlayer &&
      gameState.computerDifficulty
    ) {
      const difficulty = gameState.computerDifficulty;
      const board = gameState.board;
      const player = gameState.currentPlayer;

      // Delay computer move for realism (800ms)
      const timeout = setTimeout(() => {
        try {
          const computerMove = selectComputerMove(board, player, difficulty);
          handleMove(computerMove);
        } catch (error) {
          console.error('Computer move error:', error);
          // If computer can't move, game is likely over
        }
      }, 800);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentPlayer, gameState.computerPlayer, isAnimating, gameState.gameOver]);

  const resetGame = useCallback(() => {
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 1,
      player1Type: gameState.player1Type,
      player2Type: gameState.player2Type,
      gameOver: false,
      winner: null,
      lastMove: null,
      computerPlayer: gameState.computerPlayer,
      computerDifficulty: gameState.computerDifficulty,
    });
    setIsAnimating(false);
    setAnimatingPit(null);
    setNotification(null);
  }, [
    gameState.player1Type,
    gameState.player2Type,
    gameState.computerPlayer,
    gameState.computerDifficulty,
  ]);

  const switchPlayerTypes = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      player1Type: prev.player2Type,
      player2Type: prev.player1Type,
    }));
  }, []);

  const getScore = useCallback(
    (player: Player): number => {
      return gameState.board[getPlayerStore(player)];
    },
    [gameState.board]
  );

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    gameState,
    isAnimating,
    animatingPit,
    notification,
    handleMove,
    resetGame,
    switchPlayerTypes,
    getScore,
    closeNotification,
  };
}
