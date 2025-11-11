import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoomJoiner from './index';

// Mock router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('RoomJoiner', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component with input field and buttons', () => {
    render(<RoomJoiner onBack={mockOnBack} />);

    expect(screen.getByText('Join Game Room')).toBeInTheDocument();
    expect(screen.getByText(/enter the room code shared by your opponent/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter room code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join room/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('should have Join Room button disabled initially', () => {
    render(<RoomJoiner onBack={mockOnBack} />);

    const joinButton = screen.getByRole('button', { name: /join room/i });
    expect(joinButton).toBeDisabled();
  });

  it('should enable Join Room button when 6 characters are entered', async () => {
    const user = userEvent.setup();
    render(<RoomJoiner onBack={mockOnBack} />);

    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, 'ABC123');

    await waitFor(() => {
      const joinButton = screen.getByRole('button', { name: /join room/i });
      expect(joinButton).not.toBeDisabled();
    });
  });

  it('should convert input to uppercase automatically', async () => {
    const user = userEvent.setup();
    render(<RoomJoiner onBack={mockOnBack} />);

    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, 'abc123');

    expect(input).toHaveValue('ABC123');
  });

  it('should limit input to 6 characters', async () => {
    const user = userEvent.setup();
    render(<RoomJoiner onBack={mockOnBack} />);

    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, 'ABCDEFGH');

    expect(input).toHaveValue('ABCDEF');
  });

  it('should navigate to game room when Join Room button is clicked', async () => {
    const user = userEvent.setup();
    render(<RoomJoiner onBack={mockOnBack} />);

    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, 'ABC123');

    const joinButton = screen.getByRole('button', { name: /join room/i });
    await user.click(joinButton);

    expect(mockPush).toHaveBeenCalledWith('/game/ABC123');
  });

  it('should navigate to game room when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<RoomJoiner onBack={mockOnBack} />);

    const input = screen.getByPlaceholderText('Enter room code');
    await user.type(input, 'ABC123');
    await user.keyboard('{Enter}');

    expect(mockPush).toHaveBeenCalledWith('/game/ABC123');
  });

  it('should trim whitespace from room code before navigating', async () => {
    const user = userEvent.setup();
    render(<RoomJoiner onBack={mockOnBack} />);

    const input = screen.getByPlaceholderText('Enter room code');
    // Since input converts to uppercase, type lowercase to test trim
    await user.type(input, 'abc');

    // Manually set value with spaces to test trim functionality
    await user.clear(input);
    await user.type(input, ' ABC12 ');

    const joinButton = screen.getByRole('button', { name: /join room/i });
    await user.click(joinButton);

    expect(mockPush).toHaveBeenCalledWith('/game/ABC12');
  });

  it('should call onBack when Back button is clicked', async () => {
    const user = userEvent.setup();
    render(<RoomJoiner onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: /back/i });
    await user.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should have autofocus on the input field', () => {
    render(<RoomJoiner onBack={mockOnBack} />);

    const input = screen.getByPlaceholderText('Enter room code');
    // In React Testing Library with jsdom, autofocus is applied via the autoFocus prop
    // We can verify the input exists and is ready for user input
    expect(input).toBeInTheDocument();
    expect(document.activeElement).toBe(input);
  });

  it('should not navigate when room code is empty and Join is clicked', async () => {
    const user = userEvent.setup();
    render(<RoomJoiner onBack={mockOnBack} />);

    // Button should be disabled, but test the handler logic
    const input = screen.getByPlaceholderText('Enter room code');
    await user.clear(input);

    // Since button is disabled, we can't click it
    // But we can verify it stays disabled
    const joinButton = screen.getByRole('button', { name: /join room/i });
    expect(joinButton).toBeDisabled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
