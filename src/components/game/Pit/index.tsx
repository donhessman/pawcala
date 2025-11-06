'use client';

import { PitProps } from '@/types/game';
import { StyledPitPaper, StyledStoneCount, StyledPlayerLabel } from './styles';

const Pit = ({
  index,
  stones,
  isStore,
  player,
  isClickable,
  onClick,
  isHighlighted = false,
  isAnimating = false,
}: PitProps) => {
  const handleClick = () => {
    if (isClickable && !isStore) {
      onClick();
    }
  };

  return (
    <StyledPitPaper
      data-pit-index={index}
      elevation={isHighlighted || isAnimating ? 8 : 3}
      onClick={handleClick}
      isStore={isStore}
      isClickable={isClickable}
      isHighlighted={isHighlighted}
      isAnimating={isAnimating}
    >
      <StyledStoneCount variant={isStore ? 'h3' : 'h4'} isStore={isStore}>
        {stones}
      </StyledStoneCount>

      {isStore && <StyledPlayerLabel>Player {player}</StyledPlayerLabel>}
    </StyledPitPaper>
  );
};

export default Pit;
