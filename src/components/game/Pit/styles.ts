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
  width: isStore ? 120 : 100,
  height: isStore ? 280 : 100,
  borderRadius: isStore ? theme.spacing(8) : '50%',
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
  border: `${isHighlighted || isAnimating ? 4 : 3}px solid`,
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
}));

interface StyledStoneCountProps {
  isStore: boolean;
}

export const StyledStoneCount = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isStore',
})<StyledStoneCountProps>(({ theme, isStore }) => ({
  variant: isStore ? 'h3' : 'h4',
  fontWeight: 'bold',
  color: isStore ? theme.palette.primary.contrastText : theme.palette.text.primary,
}));

export const StyledPlayerLabel = styled(Typography)(({ theme }) => ({
  variant: 'body2',
  color: theme.palette.primary.contrastText,
  marginTop: theme.spacing(1),
  textTransform: 'uppercase',
  fontWeight: 'bold',
}));
