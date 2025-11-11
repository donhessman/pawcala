'use client';

import { Typography } from '@mui/material';
import Pit from '../Pit';
import { GameState, Player } from '@/types/game';
import { getPlayerPits, PLAYER_1_STORE, PLAYER_2_STORE } from '@/utils/gameLogic';
import {
  StyledBoardPaper,
  StyledBoardContainer,
  StyledMainGameArea,
  StyledPlayerLabel,
  StyledPlayerName,
  StyledPitsRow,
} from './styles';

interface MancalaBoardProps {
  gameState: GameState;
  onPitClick: (pitIndex: number) => void;
  isAnimating?: boolean;
  animatingPit?: number | null;
  getScore?: (player: Player) => number;
  currentPlayer?: Player; // For multiplayer, override current player
}

const MancalaBoard = ({
  gameState,
  onPitClick,
  isAnimating = false,
  animatingPit = null,
  getScore,
  currentPlayer: propCurrentPlayer,
}: MancalaBoardProps) => {
  const { board, currentPlayer: stateCurrentPlayer, lastMove } = gameState;
  const currentPlayer = propCurrentPlayer ?? stateCurrentPlayer;

  // Default getScore function if not provided
  const defaultGetScore = (player: Player): number => {
    return player === 1 ? board[PLAYER_1_STORE] : board[PLAYER_2_STORE];
  };
  const scoreGetter = getScore ?? defaultGetScore;

  const isClickable = (pitIndex: number): boolean => {
    if (isAnimating) return false;
    const playerPits = getPlayerPits(currentPlayer);
    return playerPits.includes(pitIndex) && board[pitIndex] > 0;
  };

  const isHighlighted = (pitIndex: number): boolean => {
    return lastMove?.pitIndex === pitIndex;
  };

  const isPitAnimating = (pitIndex: number): boolean => {
    return animatingPit === pitIndex;
  };

  // Player 2 pits (top row, right to left): indices 12, 11, 10, 9, 8, 7
  const player2Pits = [12, 11, 10, 9, 8, 7];

  // Player 1 pits (bottom row, left to right): indices 0, 1, 2, 3, 4, 5
  const player1Pits = [0, 1, 2, 3, 4, 5];

  return (
    <StyledBoardPaper elevation={4}>
      <StyledBoardContainer>
        {/* Player 2 Store (left) */}
        <Pit
          index={PLAYER_2_STORE}
          stones={board[PLAYER_2_STORE]}
          isStore={true}
          player={2}
          isClickable={false}
          onClick={() => {}}
          isAnimating={isPitAnimating(PLAYER_2_STORE)}
        />

        {/* Main game area */}
        <StyledMainGameArea>
          {/* Player 2 label */}
          <StyledPlayerLabel sx={{ mb: 1 }}>
            <StyledPlayerName variant="h6" isCurrentPlayer={currentPlayer === 2}>
              {gameState.player2Type === 'dog' ? '🐕' : '🐈'} Player 2 (
              {gameState.player2Type === 'dog' ? 'Dog' : 'Cat'})
            </StyledPlayerName>
            <Typography variant="body2" color="text.secondary">
              Score: {scoreGetter(2)}
            </Typography>
          </StyledPlayerLabel>

          {/* Player 2 pits (top row) */}
          <StyledPitsRow>
            {player2Pits.map((pitIndex) => (
              <Pit
                key={pitIndex}
                index={pitIndex}
                stones={board[pitIndex]}
                isStore={false}
                player={2}
                isClickable={isClickable(pitIndex)}
                onClick={() => onPitClick(pitIndex)}
                isHighlighted={isHighlighted(pitIndex)}
                isAnimating={isPitAnimating(pitIndex)}
              />
            ))}
          </StyledPitsRow>

          {/* Player 1 pits (bottom row) */}
          <StyledPitsRow>
            {player1Pits.map((pitIndex) => (
              <Pit
                key={pitIndex}
                index={pitIndex}
                stones={board[pitIndex]}
                isStore={false}
                player={1}
                isClickable={isClickable(pitIndex)}
                onClick={() => onPitClick(pitIndex)}
                isHighlighted={isHighlighted(pitIndex)}
                isAnimating={isPitAnimating(pitIndex)}
              />
            ))}
          </StyledPitsRow>

          {/* Player 1 label */}
          <StyledPlayerLabel sx={{ mt: 1 }}>
            <StyledPlayerName variant="h6" isCurrentPlayer={currentPlayer === 1}>
              {gameState.player1Type === 'dog' ? '🐕' : '🐈'} Player 1 (
              {gameState.player1Type === 'dog' ? 'Dog' : 'Cat'})
            </StyledPlayerName>
            <Typography variant="body2" color="text.secondary">
              Score: {scoreGetter(1)}
            </Typography>
          </StyledPlayerLabel>
        </StyledMainGameArea>

        {/* Player 1 Store (right) */}
        <Pit
          index={PLAYER_1_STORE}
          stones={board[PLAYER_1_STORE]}
          isStore={true}
          player={1}
          isClickable={false}
          onClick={() => {}}
          isAnimating={isPitAnimating(PLAYER_1_STORE)}
        />
      </StyledBoardContainer>
    </StyledBoardPaper>
  );
};

export default MancalaBoard;
