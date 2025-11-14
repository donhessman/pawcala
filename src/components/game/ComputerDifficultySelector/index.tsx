'use client';

import { Box, Button, Typography, Paper } from '@mui/material';
import { ComputerDifficulty } from '@/types/game';

interface ComputerDifficultySelectorProps {
  onSelectDifficulty: (difficulty: ComputerDifficulty) => void;
  onBack: () => void;
}

const ComputerDifficultySelector = ({
  onSelectDifficulty,
  onBack,
}: ComputerDifficultySelectorProps) => {
  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom textAlign="center">
        Choose Difficulty
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => onSelectDifficulty('easy')}
          fullWidth
          color="success"
        >
          Easy
        </Button>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Random moves - Perfect for beginners
        </Typography>

        <Box sx={{ my: 1, borderBottom: 1, borderColor: 'divider' }} />

        <Button
          variant="contained"
          size="large"
          onClick={() => onSelectDifficulty('medium')}
          fullWidth
          color="warning"
        >
          Medium
        </Button>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Strategic moves - A good challenge
        </Typography>

        <Box sx={{ my: 1, borderBottom: 1, borderColor: 'divider' }} />

        <Button
          variant="contained"
          size="large"
          onClick={() => onSelectDifficulty('hard')}
          fullWidth
          color="error"
        >
          Hard
        </Button>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Advanced strategy - Very challenging
        </Typography>

        <Box sx={{ my: 2, borderBottom: 1, borderColor: 'divider' }} />

        <Button variant="outlined" size="medium" onClick={onBack} fullWidth>
          Back
        </Button>
      </Box>
    </Paper>
  );
};

export default ComputerDifficultySelector;
