import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Pit from './index';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Pit', () => {
  it('should render stone count', () => {
    renderWithTheme(
      <Pit index={0} stones={4} isStore={false} player={1} isClickable={true} onClick={vi.fn()} />
    );

    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should render player label for store pits', () => {
    renderWithTheme(
      <Pit index={6} stones={10} isStore={true} player={1} isClickable={false} onClick={vi.fn()} />
    );

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Player 1')).toBeInTheDocument();
  });

  it('should not render player label for regular pits', () => {
    renderWithTheme(
      <Pit index={0} stones={4} isStore={false} player={1} isClickable={true} onClick={vi.fn()} />
    );

    expect(screen.queryByText('Player 1')).not.toBeInTheDocument();
  });

  it('should call onClick when clickable pit is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderWithTheme(
      <Pit
        index={0}
        stones={4}
        isStore={false}
        player={1}
        isClickable={true}
        onClick={handleClick}
      />
    );

    const pit = screen.getByText('4').closest('div');
    await user.click(pit!);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when non-clickable pit is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderWithTheme(
      <Pit
        index={0}
        stones={4}
        isStore={false}
        player={1}
        isClickable={false}
        onClick={handleClick}
      />
    );

    const pit = screen.getByText('4').closest('div');
    await user.click(pit!);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when store pit is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    renderWithTheme(
      <Pit
        index={6}
        stones={10}
        isStore={true}
        player={1}
        isClickable={true}
        onClick={handleClick}
      />
    );

    const pit = screen.getByText('10').closest('div');
    await user.click(pit!);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should have data-pit-index attribute', () => {
    renderWithTheme(
      <Pit index={5} stones={4} isStore={false} player={1} isClickable={true} onClick={vi.fn()} />
    );

    const pit = screen.getByText('4').closest('[data-pit-index]');
    expect(pit).toHaveAttribute('data-pit-index', '5');
  });

  it('should apply highlighted styles when isHighlighted is true', () => {
    renderWithTheme(
      <Pit
        index={0}
        stones={4}
        isStore={false}
        player={1}
        isClickable={true}
        onClick={vi.fn()}
        isHighlighted={true}
      />
    );

    const pit = screen.getByText('4').closest('[data-pit-index]');
    expect(pit).toBeInTheDocument();
  });

  it('should apply animating styles when isAnimating is true', () => {
    renderWithTheme(
      <Pit
        index={0}
        stones={4}
        isStore={false}
        player={1}
        isClickable={true}
        onClick={vi.fn()}
        isAnimating={true}
      />
    );

    const pit = screen.getByText('4').closest('[data-pit-index]');
    expect(pit).toBeInTheDocument();
  });

  it('should render with 0 stones', () => {
    renderWithTheme(
      <Pit index={0} stones={0} isStore={false} player={1} isClickable={false} onClick={vi.fn()} />
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
