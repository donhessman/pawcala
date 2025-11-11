import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameModeSelector from './index';

describe('GameModeSelector', () => {
  it('should render the component with both game mode options', () => {
    const mockOnSelectMode = vi.fn();
    render(<GameModeSelector onSelectMode={mockOnSelectMode} />);

    expect(screen.getByText('Choose Game Mode')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /local game/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /online multiplayer/i })).toBeInTheDocument();
  });

  it('should display descriptive text for each mode', () => {
    const mockOnSelectMode = vi.fn();
    render(<GameModeSelector onSelectMode={mockOnSelectMode} />);

    expect(screen.getByText('Play on the same device')).toBeInTheDocument();
    expect(screen.getByText('Play against someone online')).toBeInTheDocument();
  });

  it('should call onSelectMode with "local" when Local Game button is clicked', async () => {
    const mockOnSelectMode = vi.fn();
    const user = userEvent.setup();

    render(<GameModeSelector onSelectMode={mockOnSelectMode} />);

    const localButton = screen.getByRole('button', { name: /local game/i });
    await user.click(localButton);

    expect(mockOnSelectMode).toHaveBeenCalledTimes(1);
    expect(mockOnSelectMode).toHaveBeenCalledWith('local');
  });

  it('should call onSelectMode with "online" when Online Multiplayer button is clicked', async () => {
    const mockOnSelectMode = vi.fn();
    const user = userEvent.setup();

    render(<GameModeSelector onSelectMode={mockOnSelectMode} />);

    const onlineButton = screen.getByRole('button', { name: /online multiplayer/i });
    await user.click(onlineButton);

    expect(mockOnSelectMode).toHaveBeenCalledTimes(1);
    expect(mockOnSelectMode).toHaveBeenCalledWith('online');
  });
});
