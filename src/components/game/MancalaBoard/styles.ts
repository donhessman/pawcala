import { styled } from '@mui/material/styles';
import { Paper, Box, Typography } from '@mui/material';

export const StyledBoardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(4),
  maxWidth: 1600,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

export const StyledBoardContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 32,
});

export const StyledMainGameArea = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
});

export const StyledPlayerLabel = styled(Box)({
  textAlign: 'center',
});

interface StyledPlayerNameProps {
  isCurrentPlayer: boolean;
}

export const StyledPlayerName = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isCurrentPlayer',
})<StyledPlayerNameProps>(({ theme, isCurrentPlayer }) => ({
  variant: 'h6',
  fontWeight: 'bold',
  color: isCurrentPlayer ? theme.palette.secondary.main : theme.palette.text.secondary,
}));

export const StyledPitsRow = styled(Box)({
  display: 'flex',
  gap: 16,
  justifyContent: 'center',
});
