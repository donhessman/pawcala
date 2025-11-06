import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

interface StyledPawContainerProps {
  left: number;
  top: number;
  isInitialSlide: boolean;
}

export const StyledPawContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'left' && prop !== 'top' && prop !== 'isInitialSlide',
})<StyledPawContainerProps>(({ left, top, isInitialSlide }) => ({
  position: 'fixed',
  left,
  top,
  zIndex: 9999,
  pointerEvents: 'none',
  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))',
  transition: isInitialSlide
    ? 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    : 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
}));
