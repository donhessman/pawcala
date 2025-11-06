import { styled } from '@mui/material/styles';
import { Container, Box, Typography } from '@mui/material';

export const StyledPageContainer = styled(Container)({
  maxWidth: 1600,
  paddingTop: 32,
  paddingBottom: 32,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

export const StyledHeader = styled(Box)({
  textAlign: 'center',
  marginBottom: 24,
});

export const StyledTitle = styled(Typography)(() => ({
  fontWeight: 'bold',
})) as typeof Typography;

export const StyledBoardWrapper = styled(Box)({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 24,
  marginBottom: 24,
});

export const StyledInstructionsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
}));
