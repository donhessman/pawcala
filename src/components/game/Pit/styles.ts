import { styled } from '@mui/material/styles';
import { Paper, Typography } from '@mui/material';

interface StyledPitPaperProps {
  isStore: boolean;
  isClickable: boolean;
  isHighlighted: boolean;
  isAnimating: boolean;
}

export const StyledPitPaper = styled(Paper, {
  shouldForwardProp: (prop) =>
    prop !== 'isStore' &&
    prop !== 'isClickable' &&
    prop !== 'isHighlighted' &&
    prop !== 'isAnimating',
})<StyledPitPaperProps>(({ theme, isStore, isClickable, isHighlighted, isAnimating }) => ({
  // Mobile-first sizing (extra small for narrow screens)
  width: isStore ? 35 : 32,
  height: isStore ? 90 : 32,
  borderRadius: isStore ? theme.spacing(2) : '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: isClickable && !isStore ? 'pointer' : 'default',
  backgroundColor: isAnimating
    ? theme.palette.secondary.light
    : isStore
      ? theme.palette.primary.light
      : theme.palette.background.paper,
  border: `${isHighlighted || isAnimating ? 3 : 2}px solid`,
  borderColor: isAnimating
    ? theme.palette.secondary.main
    : isHighlighted
      ? theme.palette.secondary.main
      : theme.palette.primary.main,
  transition: 'all 0.15s ease',
  position: 'relative',
  transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
  '&:hover':
    isClickable && !isStore
      ? {
          transform: 'scale(1.05)',
          boxShadow: theme.shadows[6],
          borderColor: theme.palette.secondary.main,
        }
      : {},
  // Tablet sizing
  [theme.breakpoints.up('sm')]: {
    width: isStore ? 80 : 70,
    height: isStore ? 180 : 70,
    borderRadius: isStore ? theme.spacing(5) : '50%',
    border: `${isHighlighted || isAnimating ? 3 : 2}px solid`,
  },
  // Desktop sizing
  [theme.breakpoints.up('md')]: {
    width: isStore ? 100 : 85,
    height: isStore ? 220 : 85,
    borderRadius: isStore ? theme.spacing(6) : '50%',
    border: `${isHighlighted || isAnimating ? 4 : 3}px solid`,
  },
  // Large desktop sizing
  [theme.breakpoints.up('lg')]: {
    width: isStore ? 120 : 100,
    height: isStore ? 280 : 100,
    borderRadius: isStore ? theme.spacing(8) : '50%',
  },
}));

interface StyledStoneCountProps {
  isStore: boolean;
}

export const StyledStoneCount = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isStore',
})<StyledStoneCountProps>(({ theme, isStore }) => ({
  variant: isStore ? 'h3' : 'h4',
  fontWeight: 'bold',
  fontSize: isStore ? '0.875rem' : '0.75rem',
  color: isStore ? theme.palette.primary.contrastText : theme.palette.text.primary,
  [theme.breakpoints.up('sm')]: {
    fontSize: isStore ? '1.75rem' : '1.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: isStore ? '2.5rem' : '2rem',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: isStore ? '3rem' : '2.125rem',
  },
}));

export const StyledPlayerLabel = styled(Typography)(({ theme }) => ({
  variant: 'body2',
  fontSize: '0.5rem',
  color: theme.palette.primary.contrastText,
  marginTop: theme.spacing(0.25),
  textTransform: 'uppercase',
  fontWeight: 'bold',
  [theme.breakpoints.up('sm')]: {
    fontSize: '0.75rem',
    marginTop: theme.spacing(0.75),
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '0.875rem',
    marginTop: theme.spacing(1),
  },
}));
