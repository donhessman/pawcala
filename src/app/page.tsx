'use client';

import { useState } from 'react';
import { Typography, Snackbar, Alert, Button, Box } from '@mui/material';
import MancalaBoard from '@/components/game/MancalaBoard';
import GameControls from '@/components/game/GameControls';
import PawAnimation from '@/components/game/PawAnimation';
import GameModeSelector from '@/components/multiplayer/GameModeSelector';
import RoomCreator from '@/components/multiplayer/RoomCreator';
import RoomJoiner from '@/components/multiplayer/RoomJoiner';
import { useGameState } from '@/hooks/useGameState';
import { GameMode } from '@/types/multiplayer';
import {
  StyledPageContainer,
  StyledHeader,
  StyledTitle,
  StyledBoardWrapper,
  StyledInstructionsBox,
} from './page.styles';

type OnlineView = 'menu' | 'create' | 'join';

const Home = () => {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [onlineView, setOnlineView] = useState<OnlineView>('menu');

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

  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'online') {
      setOnlineView('menu');
    }
  };

  const handleBackToModeSelection = () => {
    setGameMode(null);
    setOnlineView('menu');
  };

  const handleBackToOnlineMenu = () => {
    setOnlineView('menu');
  };

  // Show game mode selector if no mode selected
  if (gameMode === null) {
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
        <GameModeSelector onSelectMode={handleSelectMode} />
      </StyledPageContainer>
    );
  }

  // Show online multiplayer menu
  if (gameMode === 'online') {
    return (
      <StyledPageContainer maxWidth={false}>
        <StyledHeader>
          <StyledTitle variant="h3" component="h1" gutterBottom>
            🐾 Pawcala 🐾
          </StyledTitle>
          <Typography variant="body1" color="text.secondary">
            Online Multiplayer
          </Typography>
        </StyledHeader>

        {onlineView === 'menu' && (
          <Box sx={{ maxWidth: 500, mx: 'auto', px: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setOnlineView('create')}
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Create Room
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setOnlineView('join')}
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Join Room
              </Button>
            </Box>
            <Button
              variant="text"
              onClick={handleBackToModeSelection}
              fullWidth
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Back to Mode Selection
            </Button>
          </Box>
        )}

        {onlineView === 'create' && <RoomCreator onBack={handleBackToOnlineMenu} />}

        {onlineView === 'join' && <RoomJoiner onBack={handleBackToOnlineMenu} />}
      </StyledPageContainer>
    );
  }

  // Show local game
  return (
    <StyledPageContainer maxWidth={false}>
      <StyledHeader>
        <StyledTitle variant="h3" component="h1" gutterBottom>
          🐾 Pawcala 🐾
        </StyledTitle>
        <Typography variant="body1" color="text.secondary">
          Local Game
        </Typography>
        <Button variant="text" size="small" onClick={handleBackToModeSelection} sx={{ mt: 1 }}>
          Change Mode
        </Button>
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
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          How to Play:
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          • Click on one of your pits (bottom row for Player 1, top row for Player 2)
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          • Stones are distributed counter-clockwise, one per pit
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          • Land in your store? Take another turn!
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          • Land in an empty pit on your side? Capture opposite stones!
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          • Game ends when one side is empty. Most stones wins!
        </Typography>
      </StyledInstructionsBox>
    </StyledPageContainer>
  );
};

export default Home;
