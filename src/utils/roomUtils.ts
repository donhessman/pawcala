export const generateRoomCode = (): string => {
  // Generate a 6-character alphanumeric room code
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous characters
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const generatePlayerId = (): string => {
  return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
