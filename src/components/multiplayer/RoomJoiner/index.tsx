'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Paper, TextField } from '@mui/material';

interface RoomJoinerProps {
  onBack: () => void;
}

const RoomJoiner = ({ onBack }: RoomJoinerProps) => {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      router.push(`/game/${roomCode.trim().toUpperCase()}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom textAlign="center">
        Join Game Room
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          Enter the room code shared by your opponent
        </Typography>

        <TextField
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          placeholder="Enter room code"
          fullWidth
          autoFocus
          inputProps={{
            maxLength: 6,
            style: {
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              letterSpacing: '0.2em',
            },
          }}
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleJoinRoom}
          fullWidth
          disabled={roomCode.length < 6}
        >
          Join Room
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button variant="text" onClick={onBack} fullWidth>
          Back
        </Button>
      </Box>
    </Paper>
  );
};

export default RoomJoiner;
