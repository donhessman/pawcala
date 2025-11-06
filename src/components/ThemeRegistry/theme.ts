'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1', // Vibrant indigo
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F59E0B', // Bright amber/gold
      light: '#FCD34D',
      dark: '#D97706',
    },
    success: {
      main: '#10B981', // Emerald green for Player 1
    },
    warning: {
      main: '#EC4899', // Pink for Player 2
    },
    background: {
      default: '#F0F9FF', // Light sky blue
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937', // Dark gray
      secondary: '#6B7280', // Medium gray
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;
