import { styled } from '@mui/material/styles';
import { Paper, Box, Typography } from '@mui/material';

export const StyledBoardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(1.5),
  maxWidth: 1600,
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
    borderRadius: theme.spacing(4),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(6),
  },
}));

export const StyledBoardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
  gap: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(3),
  },
  [theme.breakpoints.up('lg')]: {
    gap: theme.spacing(4),
  },
}));

export const StyledMainGameArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(3),
  },
}));

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
  fontSize: '0.7rem',
  color: isCurrentPlayer ? theme.palette.secondary.main : theme.palette.text.secondary,
  [theme.breakpoints.up('sm')]: {
    fontSize: '1rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.25rem',
  },
}));

export const StyledPitsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  justifyContent: 'center',
  flexWrap: 'nowrap',
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(1.5),
  },
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(2),
  },
}));
