'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Paper, TextField, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { generateRoomCode } from '@/utils/roomUtils';

interface RoomCreatorProps {
  onBack: () => void;
}

const RoomCreator = ({ onBack }: RoomCreatorProps) => {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleCreateRoom = () => {
    const code = generateRoomCode();
    setRoomCode(code);
  };

  const handleCopyCode = async () => {
    if (roomCode) {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoinRoom = () => {
    if (roomCode) {
      router.push(`/game/${roomCode}`);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom textAlign="center">
        Create Game Room
      </Typography>

      {!roomCode ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Create a room and share the code with your opponent
          </Typography>
          <Button variant="contained" size="large" onClick={handleCreateRoom} fullWidth>
            Generate Room Code
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Room created! Share this code with your opponent:
          </Alert>

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              value={roomCode}
              fullWidth
              InputProps={{
                readOnly: true,
                sx: {
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  letterSpacing: '0.2em',
                },
              }}
            />
            <Button
              variant="outlined"
              onClick={handleCopyCode}
              startIcon={<ContentCopyIcon />}
              sx={{ minWidth: 100 }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </Box>

          <Button variant="contained" size="large" onClick={handleJoinRoom} fullWidth>
            Enter Room
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <Button variant="text" onClick={onBack} fullWidth>
          Back
        </Button>
      </Box>
    </Paper>
  );
};

export default RoomCreator;
