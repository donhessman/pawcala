'use client';

import { useState, useCallback } from 'react';
import { GameState, Player, GameNotification } from '@/types/game';
import { createInitialBoard, makeMove, isValidMove, getPlayerStore } from '@/utils/gameLogic';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createInitialBoard(),
    currentPlayer: 1,
    player1Type: 'dog',
    player2Type: 'cat',
    gameOver: false,
    winner: null,
    lastMove: null,
  }));

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

  const resetGame = useCallback(() => {
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 1,
      player1Type: gameState.player1Type,
      player2Type: gameState.player2Type,
      gameOver: false,
      winner: null,
      lastMove: null,
    });
    setIsAnimating(false);
    setAnimatingPit(null);
    setNotification(null);
  }, [gameState.player1Type, gameState.player2Type]);

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
