'use client';

import { Box, Button, Typography, Paper } from '@mui/material';
import { GameMode } from '@/types/multiplayer';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
}

const GameModeSelector = ({ onSelectMode }: GameModeSelectorProps) => {
  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom textAlign="center">
        Choose Game Mode
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
        <Button variant="contained" size="large" onClick={() => onSelectMode('local')} fullWidth>
          Local Game
        </Button>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Play on the same device
        </Typography>

        <Box sx={{ my: 1, borderBottom: 1, borderColor: 'divider' }} />

        <Button variant="contained" size="large" onClick={() => onSelectMode('computer')} fullWidth>
          Play vs Computer
        </Button>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Challenge the computer opponent
        </Typography>

        <Box sx={{ my: 1, borderBottom: 1, borderColor: 'divider' }} />

        <Button variant="outlined" size="large" onClick={() => onSelectMode('online')} fullWidth>
          Online Multiplayer
        </Button>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Play against someone online
        </Typography>
      </Box>
    </Paper>
  );
};

export default GameModeSelector;
