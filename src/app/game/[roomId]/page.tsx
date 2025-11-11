'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, Paper, Alert } from '@mui/material';
import { createClient } from '@/utils/supabase/client';
import { createInitialBoard, makeMove } from '@/utils/gameLogic';
import {
  GameState,
  Player,
  PlayerType,
  BroadcastMovePayload,
  PlayerInfo,
  StateRequestPayload,
  StateSyncPayload,
} from '@/types/game';
import { JoinRoomPayload, PlayerPresencePayload } from '@/types/multiplayer';
import { generatePlayerId } from '@/utils/roomUtils';
import MancalaBoard from '@/components/game/MancalaBoard';
import PawAnimation from '@/components/game/PawAnimation';
import type { RealtimeChannel } from '@supabase/supabase-js';

const GamePage = () => {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createInitialBoard(),
    currentPlayer: 1,
    player1Type: 'dog',
    player2Type: 'cat',
    gameOver: false,
    winner: null,
    lastMove: null,
  }));

  const [localPlayerNumber, setLocalPlayerNumber] = useState<Player | null>(null);
  const [playerId] = useState(() => {
    // Use a stable player ID stored in sessionStorage for this tab
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`pawcala_player_${roomId}`);
      if (stored) return stored;
      const newId = generatePlayerId();
      sessionStorage.setItem(`pawcala_player_${roomId}`, newId);
      return newId;
    }
    return generatePlayerId();
  });
  const [playerName] = useState(() => `Player ${Math.floor(Math.random() * 1000)}`);
  const [players, setPlayers] = useState<{
    player1: PlayerInfo | null;
    player2: PlayerInfo | null;
  }>({
    player1: null,
    player2: null,
  });
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>(
    'connecting'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingPit, setAnimatingPit] = useState<number | null>(null);

  const supabase = createClient();

  // Initialize channel and subscriptions
  useEffect(() => {
    // Use room-based presence key so we can detect which slots are taken
    const gameChannel = supabase.channel(`game:${roomId}`, {
      config: {
        broadcast: { self: false }, // Don't receive our own broadcasts
      },
    });

    // Subscribe to game moves
    gameChannel
      .on('broadcast', { event: 'move' }, ({ payload }) => {
        const movePayload = payload as BroadcastMovePayload;
        const { moveResult, pitIndex } = movePayload;

        setIsAnimating(true);
        setAnimatingPit(pitIndex);

        // Capture the current board state for animation
        let capturedBoard: number[] | null = null;
        setGameState((prev) => {
          capturedBoard = [...prev.board];
          return prev; // No change yet
        });

        // After 800ms slide-in animation, empty the clicked pit
        setTimeout(() => {
          setGameState((prev) => {
            const newBoard = [...prev.board];
            newBoard[pitIndex] = 0;
            return { ...prev, board: newBoard };
          });

          // Wait 200ms pause at the clicked pit before starting distribution
          setTimeout(() => {
            // Use the captured board state with clicked pit emptied
            const initialBoard = capturedBoard ? [...capturedBoard] : [];
            initialBoard[pitIndex] = 0;

            // Distribute stones sequentially through the path
            moveResult.distributionPath.forEach((pit, index) => {
              setTimeout(() => {
                setAnimatingPit(pit);
                initialBoard[pit]++;

                setGameState((prev) => ({
                  ...prev,
                  board: [...initialBoard],
                }));

                // On last stone
                if (index === moveResult.distributionPath.length - 1) {
                  setTimeout(() => {
                    setAnimatingPit(null);

                    // Final state update
                    setGameState((prev) => ({
                      ...prev,
                      board: moveResult.newBoard,
                      currentPlayer: moveResult.extraTurn
                        ? movePayload.player
                        : movePayload.player === 1
                          ? 2
                          : 1,
                      gameOver: moveResult.gameOver,
                      winner: moveResult.winner,
                      lastMove: {
                        pitIndex: movePayload.pitIndex,
                        player: movePayload.player,
                      },
                    }));

                    setIsAnimating(false);
                  }, 200);
                }
              }, index * 200);
            });
          }, 200);
        }, 800);
      })
      .on('broadcast', { event: 'join' }, ({ payload }) => {
        const joinPayload = payload as JoinRoomPayload;
        const newPlayer: PlayerInfo = {
          id: joinPayload.playerId,
          name: joinPayload.playerName,
          type: joinPayload.playerType,
          online: true,
          lastSeen: joinPayload.timestamp,
        };

        setPlayers((prev) => ({
          ...prev,
          [`player${joinPayload.playerNumber}`]: newPlayer,
        }));
      })
      .on('broadcast', { event: 'state_request' }, ({ payload }) => {
        const request = payload as StateRequestPayload;

        // If I'm not the requester, send my current state
        if (request.requesterId !== playerId) {
          // Use setGameState callback to access current state
          setGameState((currentState) => {
            // Check if the game has started (any non-store pit changed from initial state)
            const gameHasStarted = currentState.board.some((stones, i) => {
              if (i === 6 || i === 13) return false; // Skip stores
              return stones !== 4;
            });

            if (gameHasStarted) {
              gameChannel.send({
                type: 'broadcast',
                event: 'state_sync',
                payload: {
                  type: 'state_sync',
                  gameState: {
                    board: currentState.board,
                    currentPlayer: currentState.currentPlayer,
                    gameOver: currentState.gameOver,
                    winner: currentState.winner,
                  },
                  timestamp: new Date().toISOString(),
                } as StateSyncPayload,
              });
            }

            return currentState; // No state change
          });
        }
      })
      .on('broadcast', { event: 'state_sync' }, ({ payload }) => {
        const sync = payload as StateSyncPayload;

        // Update my game state with the received state
        setGameState((prev) => ({
          ...prev,
          board: sync.gameState.board,
          currentPlayer: sync.gameState.currentPlayer,
          gameOver: sync.gameState.gameOver,
          winner: sync.gameState.winner,
        }));
      })
      .on('presence', { event: 'sync' }, () => {
        const state = gameChannel.presenceState<PlayerPresencePayload>();
        const presenceList = Object.values(state).flat();

        setPlayers((prev) => {
          const updated = { ...prev };
          presenceList.forEach((presence) => {
            const playerKey = `player${presence.playerNumber}` as 'player1' | 'player2';
            if (updated[playerKey]) {
              updated[playerKey] = {
                ...updated[playerKey]!,
                online: presence.online,
              };
            }
          });
          return updated;
        });
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        newPresences.forEach((presence: PlayerPresencePayload) => {
          const playerKey = `player${presence.playerNumber}` as 'player1' | 'player2';
          setPlayers((prev) => ({
            ...prev,
            [playerKey]: prev[playerKey]
              ? { ...prev[playerKey]!, online: true }
              : {
                  id: presence.playerId,
                  name: presence.playerName,
                  type: 'dog',
                  online: true,
                  lastSeen: new Date().toISOString(),
                },
          }));
        });
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        leftPresences.forEach((presence: PlayerPresencePayload) => {
          const playerKey = `player${presence.playerNumber}` as 'player1' | 'player2';
          setPlayers((prev) => ({
            ...prev,
            [playerKey]: prev[playerKey] ? { ...prev[playerKey]!, online: false } : null,
          }));
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          setChannel(gameChannel);

          // Wait a moment for presence sync, then determine player number
          await new Promise((resolve) => setTimeout(resolve, 100));

          const presenceState = gameChannel.presenceState<PlayerPresencePayload>();
          const existingPlayers = Object.values(presenceState).flat();

          // Try to reclaim previous player number from sessionStorage (for refreshes)
          const storedPlayerNumber = sessionStorage.getItem(`pawcala_player_number_${roomId}`);

          // Check which player slots are taken by OTHER players (not our old session)
          const player1TakenByOthers = existingPlayers.some(
            (p) => p.playerNumber === 1 && p.playerId !== playerId
          );
          const player2TakenByOthers = existingPlayers.some(
            (p) => p.playerNumber === 2 && p.playerId !== playerId
          );

          let assignedPlayer: number | null = null;

          // First try to reclaim our previous slot if we had one
          if (storedPlayerNumber) {
            const previousSlot = parseInt(storedPlayerNumber);
            const slotTakenByOthers =
              previousSlot === 1 ? player1TakenByOthers : player2TakenByOthers;
            if (!slotTakenByOthers) {
              assignedPlayer = previousSlot;
            }
          }

          // If we couldn't reclaim our slot, find any available slot
          if (assignedPlayer === null) {
            if (!player1TakenByOthers) {
              assignedPlayer = 1;
            } else if (!player2TakenByOthers) {
              assignedPlayer = 2;
            }
          }

          if (assignedPlayer) {
            setLocalPlayerNumber(assignedPlayer as Player);

            // Store player number in sessionStorage for refresh recovery
            sessionStorage.setItem(`pawcala_player_number_${roomId}`, assignedPlayer.toString());

            // Track presence with player number as key (so refreshes reuse the same slot)
            gameChannel.track(
              {
                playerId,
                playerName,
                playerNumber: assignedPlayer,
                online: true,
              } as PlayerPresencePayload,
              { key: `player_${assignedPlayer}` } // Use player number as presence key
            );

            // Broadcast join message
            gameChannel.send({
              type: 'broadcast',
              event: 'join',
              payload: {
                type: 'join',
                playerId,
                playerName,
                playerNumber: assignedPlayer,
                playerType: assignedPlayer === 1 ? 'dog' : 'cat',
                timestamp: new Date().toISOString(),
              } as JoinRoomPayload,
            });

            // Request current game state from other players
            setTimeout(() => {
              gameChannel.send({
                type: 'broadcast',
                event: 'state_request',
                payload: {
                  type: 'state_request',
                  requesterId: playerId,
                  timestamp: new Date().toISOString(),
                } as StateRequestPayload,
              });
            }, 500); // Wait 500ms to ensure other players have received the join
          } else {
            setErrorMessage('Room is full');
            setConnectionStatus('error');
          }
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('error');
          setErrorMessage('Failed to connect to game room');
        }
      });

    // Cleanup on unmount
    return () => {
      gameChannel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, playerId, playerName]);

  const handlePitClick = useCallback(
    async (pitIndex: number) => {
      if (!channel || localPlayerNumber === null || gameState.currentPlayer !== localPlayerNumber) {
        return;
      }

      // Capture current board state before animation
      const capturedBoard = [...gameState.board];

      // Calculate move locally
      const moveResult = makeMove(capturedBoard, pitIndex, gameState.currentPlayer);

      setIsAnimating(true);
      setAnimatingPit(pitIndex);

      // After 800ms slide-in animation, empty the clicked pit
      setTimeout(() => {
        setGameState((prev) => {
          const newBoard = [...prev.board];
          newBoard[pitIndex] = 0;
          return { ...prev, board: newBoard };
        });

        // Wait 200ms pause at the clicked pit before starting distribution
        setTimeout(() => {
          // Use the captured board state with clicked pit emptied
          const initialBoard = [...capturedBoard];
          initialBoard[pitIndex] = 0;

          // Distribute stones sequentially through the path
          moveResult.distributionPath.forEach((pit, index) => {
            setTimeout(() => {
              setAnimatingPit(pit);
              initialBoard[pit]++;

              setGameState((prev) => ({
                ...prev,
                board: [...initialBoard],
              }));

              // On last stone
              if (index === moveResult.distributionPath.length - 1) {
                setTimeout(() => {
                  setAnimatingPit(null);

                  // Final state update
                  setGameState((prev) => ({
                    ...prev,
                    board: moveResult.newBoard,
                    currentPlayer: moveResult.extraTurn
                      ? prev.currentPlayer
                      : prev.currentPlayer === 1
                        ? 2
                        : 1,
                    gameOver: moveResult.gameOver,
                    winner: moveResult.winner,
                    lastMove: {
                      pitIndex,
                      player: prev.currentPlayer,
                    },
                  }));

                  setIsAnimating(false);
                }, 200);
              }
            }, index * 200);
          });
        }, 200);
      }, 800);

      // Broadcast move to opponent
      await channel.send({
        type: 'broadcast',
        event: 'move',
        payload: {
          type: 'move',
          pitIndex,
          player: gameState.currentPlayer,
          moveResult,
          timestamp: new Date().toISOString(),
        } as BroadcastMovePayload,
      });
    },
    [channel, localPlayerNumber, gameState]
  );

  const getOpponentInfo = () => {
    if (localPlayerNumber === null) return null;
    const opponentKey = localPlayerNumber === 1 ? 'player2' : 'player1';
    return players[opponentKey];
  };

  const opponent = getOpponentInfo();

  if (connectionStatus === 'connecting') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" textAlign="center">
          Connecting to game room...
        </Typography>
      </Container>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage || 'Failed to connect to game room'}
        </Alert>
        <Typography variant="body1" textAlign="center">
          <a href="/" style={{ color: 'inherit' }}>
            Return to home
          </a>
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
          Pawcala - Room {roomId}
        </Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                You are Player {localPlayerNumber} ({gameState[`player${localPlayerNumber}Type`]})
              </Typography>
            </Box>
            {opponent ? (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Opponent: {opponent.name} {opponent.online ? '🟢' : '⚫'}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Waiting for opponent...
              </Typography>
            )}
          </Box>
        </Paper>
        {gameState.currentPlayer === localPlayerNumber ? (
          <Alert severity="info">Your turn!</Alert>
        ) : (
          <Alert severity="default">Opponent's turn...</Alert>
        )}
      </Box>

      <MancalaBoard
        gameState={gameState}
        onPitClick={handlePitClick}
        currentPlayer={gameState.currentPlayer}
        isAnimating={isAnimating}
        animatingPit={animatingPit}
      />

      <PawAnimation
        pawType={gameState.currentPlayer === 1 ? gameState.player1Type : gameState.player2Type}
        isVisible={isAnimating}
        animatingPit={animatingPit}
        currentPlayer={gameState.currentPlayer}
      />

      {gameState.gameOver && (
        <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Game Over!
          </Typography>
          <Typography variant="h6">
            {gameState.winner === localPlayerNumber
              ? 'You won!'
              : gameState.winner
                ? 'Opponent won!'
                : "It's a tie!"}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default GamePage;
