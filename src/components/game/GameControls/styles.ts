import { styled } from '@mui/material/styles';
import { Paper, Box, Typography } from '@mui/material';

export const StyledControlsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  maxWidth: 900,
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(3),
  },
}));

export const StyledControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(2),
  },
}));

export const StyledButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(2),
    flexWrap: 'nowrap',
  },
}));

interface StyledStatusTextProps {
  gameOver: boolean;
}

export const StyledStatusText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'gameOver',
})<StyledStatusTextProps>(({ theme, gameOver }) => ({
  variant: 'h6',
  fontWeight: 'bold',
  fontSize: '0.875rem',
  color: gameOver ? theme.palette.success.main : theme.palette.secondary.main,
  [theme.breakpoints.up('sm')]: {
    fontSize: '1rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.25rem',
  },
}));
