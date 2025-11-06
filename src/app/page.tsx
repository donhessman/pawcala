'use client';

import { Typography, Snackbar, Alert } from '@mui/material';
import MancalaBoard from '@/components/game/MancalaBoard';
import GameControls from '@/components/game/GameControls';
import PawAnimation from '@/components/game/PawAnimation';
import { useGameState } from '@/hooks/useGameState';
import {
  StyledPageContainer,
  StyledHeader,
  StyledTitle,
  StyledBoardWrapper,
  StyledInstructionsBox,
} from './page.styles';

const Home = () => {
  const {
    gameState,
    isAnimating,
    animatingPit,
    notification,
    handleMove,
    resetGame,
    switchPlayerTypes,
    getScore,
    closeNotification,
  } = useGameState();

  const currentPawType =
    gameState.currentPlayer === 1 ? gameState.player1Type : gameState.player2Type;

  return (
    <StyledPageContainer maxWidth={false}>
      <StyledHeader>
        <StyledTitle variant="h3" component="h1" gutterBottom>
          🐾 Pawcala 🐾
        </StyledTitle>
        <Typography variant="body1" color="text.secondary">
          A playful twist on the classic Mancala game
        </Typography>
      </StyledHeader>

      <GameControls gameState={gameState} onReset={resetGame} onSwitchPlayers={switchPlayerTypes} />

      <StyledBoardWrapper>
        <MancalaBoard
          gameState={gameState}
          onPitClick={handleMove}
          isAnimating={isAnimating}
          animatingPit={animatingPit}
          getScore={getScore}
        />
      </StyledBoardWrapper>

      <PawAnimation
        pawType={currentPawType}
        isVisible={isAnimating}
        animatingPit={animatingPit}
        currentPlayer={gameState.currentPlayer}
      />

      <Snackbar
        open={notification !== null}
        autoHideDuration={3000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={closeNotification}
          severity={notification?.severity || 'info'}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>

      <StyledInstructionsBox>
        <Typography variant="h6" gutterBottom>
          How to Play:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Click on one of your pits (bottom row for Player 1, top row for Player 2)
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Stones are distributed counter-clockwise, one per pit
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Land in your store? Take another turn!
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Land in an empty pit on your side? Capture opposite stones!
        </Typography>
        <Typography variant="body2">
          • Game ends when one side is empty. Most stones wins!
        </Typography>
      </StyledInstructionsBox>
    </StyledPageContainer>
  );
};

export default Home;
