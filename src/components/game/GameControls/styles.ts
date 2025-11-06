import { styled } from '@mui/material/styles';
import { Paper, Box, Typography } from '@mui/material';

export const StyledControlsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(3),
  maxWidth: 900,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

export const StyledControlsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 16,
});

export const StyledButtonGroup = styled(Box)({
  display: 'flex',
  gap: 16,
});

interface StyledStatusTextProps {
  gameOver: boolean;
}

export const StyledStatusText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'gameOver',
})<StyledStatusTextProps>(({ theme, gameOver }) => ({
  variant: 'h6',
  fontWeight: 'bold',
  color: gameOver ? theme.palette.success.main : theme.palette.secondary.main,
}));
