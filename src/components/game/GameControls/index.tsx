'use client';

import { Box, Button, Typography } from '@mui/material';
import { GameState } from '@/types/game';
import { getGameStatus } from '@/utils/gameLogic';
import {
  StyledControlsPaper,
  StyledControlsContainer,
  StyledButtonGroup,
  StyledStatusText,
} from './styles';

interface GameControlsProps {
  gameState: GameState;
  onReset: () => void;
  onSwitchPlayers: () => void;
}

const GameControls = ({ gameState, onReset, onSwitchPlayers }: GameControlsProps) => {
  const status = getGameStatus(gameState);

  return (
    <StyledControlsPaper elevation={3}>
      <StyledControlsContainer>
        <Box>
          <StyledStatusText variant="h6" gameOver={gameState.gameOver}>
            {status}
          </StyledStatusText>
        </Box>

        <StyledButtonGroup>
          <Button variant="outlined" color="primary" onClick={onSwitchPlayers}>
            Switch Players
          </Button>
          <Button variant="contained" color="secondary" onClick={onReset}>
            New Game
          </Button>
        </StyledButtonGroup>
      </StyledControlsContainer>

      {gameState.gameOver && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Final Score - Player 1: {gameState.board[6]} | Player 2: {gameState.board[13]}
          </Typography>
        </Box>
      )}
    </StyledControlsPaper>
  );
};

export default GameControls;
