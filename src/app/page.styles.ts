import { styled } from '@mui/material/styles';
import { Container, Box, Typography } from '@mui/material';

export const StyledPageContainer = styled(Container)(({ theme }) => ({
  maxWidth: 1600,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

export const StyledHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    marginBottom: theme.spacing(3),
  },
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.75rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '3rem',
  },
})) as typeof Typography;

export const StyledBoardWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  overflow: 'auto',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

export const StyledInstructionsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  fontSize: '0.875rem',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
    fontSize: '1rem',
  },
}));
