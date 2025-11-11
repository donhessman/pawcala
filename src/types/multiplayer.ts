import { Player, PlayerType } from './game';

export interface GameRoom {
  id: string;
  roomCode: string;
  status: 'waiting' | 'active' | 'completed';
  createdAt: string;
}

export interface JoinRoomPayload {
  type: 'join';
  playerId: string;
  playerName: string;
  playerNumber: Player;
  playerType: PlayerType;
  timestamp: string;
}

export interface PlayerPresencePayload {
  playerId: string;
  playerName: string;
  playerNumber: Player;
  online: boolean;
}

export type GameMode = 'local' | 'online';
