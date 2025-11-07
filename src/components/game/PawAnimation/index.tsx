/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
'use client';

import { PlayerType } from '@/types/game';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { StyledPawContainer } from './styles';

interface PawAnimationProps {
  pawType: PlayerType;
  isVisible: boolean;
  animatingPit: number | null;
  currentPlayer: 1 | 2;
}

// Paw image dimensions (scaled to 50%)
const CAT_PAW_WIDTH = 208.5;
const CAT_PAW_HEIGHT = 684;
const DOG_PAW_WIDTH = 193;
const DOG_PAW_HEIGHT = 729.5;

// Function to get pit element position
const getPitPosition = (pitIndex: number | null): { x: number; y: number } | null => {
  if (pitIndex === null) return null;

  const pitElements = document.querySelectorAll('[data-pit-index]');
  for (const element of pitElements) {
    if (element.getAttribute('data-pit-index') === pitIndex.toString()) {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
  }
  return null;
};

const PawAnimation = ({ pawType, isVisible, animatingPit, currentPlayer }: PawAnimationProps) => {
  'use no memo';

  const [animationState, setAnimationState] = useState<{
    hasSlideIn: boolean;
    prevPit: number | null;
    prevVisible: boolean;
  }>({ hasSlideIn: false, prevPit: null, prevVisible: false });

  // Derive position from current animatingPit
  const position = isVisible && animatingPit !== null ? getPitPosition(animatingPit) : null;

  // Handle animation state changes
  useEffect(() => {
    // Visibility changed to false - reset
    if (!isVisible && animationState.prevVisible) {
      setAnimationState({ hasSlideIn: false, prevPit: null, prevVisible: false });
      return;
    }

    // Visibility changed to true
    if (isVisible && !animationState.prevVisible) {
      setAnimationState((prev) => ({ ...prev, prevVisible: true }));
    }

    // New pit to animate
    if (isVisible && animatingPit !== null && animatingPit !== animationState.prevPit) {
      const isFirstPit = animationState.prevPit === null;

      if (isFirstPit) {
        // First pit - start slide-in animation
        setAnimationState({ hasSlideIn: false, prevPit: animatingPit, prevVisible: true });

        // Trigger slide-in on next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimationState((prev) => ({ ...prev, hasSlideIn: true }));
          });
        });
      } else {
        // Subsequent pits - just update the pit
        setAnimationState((prev) => ({ ...prev, prevPit: animatingPit }));
      }
    }
  }, [isVisible, animatingPit, animationState.prevVisible, animationState.prevPit]);

  if (!isVisible || !position) return null;

  const isCat = pawType === 'cat';
  const pawWidth = isCat ? CAT_PAW_WIDTH : DOG_PAW_WIDTH;
  const pawHeight = isCat ? CAT_PAW_HEIGHT : DOG_PAW_HEIGHT;

  // Determine animation direction based on player position
  // Player 1 (bottom): paw comes from bottom
  // Player 2 (top): paw comes from top
  const isPlayer1 = currentPlayer === 1;
  const comesFromTop = !isPlayer1;

  // Image sources based on direction
  const catImage = comesFromTop ? '/img/cat-paw-from-top.png' : '/img/cat-paw-from-bottom.png';
  const dogImage = comesFromTop ? '/img/dog-paw-from-top.png' : '/img/dog-paw-from-bottom.png';
  const imageSrc = isCat ? catImage : dogImage;

  // Calculate horizontal position (center the paw over the pit)
  const leftPosition = position.x - pawWidth / 2;

  // Calculate vertical position
  // Coming from top: bottom of image should be at pit center
  // Coming from bottom: top of image should be at pit center
  const topPosition = comesFromTop
    ? position.y - pawHeight // Bottom of image at pit center
    : position.y; // Top of image at pit center

  // Initial slide-in position (off-screen)
  const initialTopPosition = comesFromTop
    ? position.y - pawHeight - 1000 // Start above and off-screen
    : position.y + 1000; // Start below and off-screen

  return (
    <StyledPawContainer
      left={leftPosition}
      top={animationState.hasSlideIn ? topPosition : initialTopPosition}
      isInitialSlide={!animationState.hasSlideIn}
    >
      <Image src={imageSrc} alt={`${pawType} paw`} width={pawWidth} height={pawHeight} />
    </StyledPawContainer>
  );
};

export default PawAnimation;
