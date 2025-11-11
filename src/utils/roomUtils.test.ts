import { describe, it, expect } from 'vitest';
import { generateRoomCode, generatePlayerId } from './roomUtils';

describe('roomUtils', () => {
  describe('generateRoomCode', () => {
    it('should generate a 6-character code', () => {
      const code = generateRoomCode();
      expect(code).toHaveLength(6);
    });

    it('should only contain valid characters (uppercase letters and numbers, excluding ambiguous ones)', () => {
      const validChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const code = generateRoomCode();

      for (const char of code) {
        expect(validChars).toContain(char);
      }
    });

    it('should not include ambiguous characters (0, O, 1, I)', () => {
      const ambiguousChars = ['0', 'O', '1', 'I'];
      const code = generateRoomCode();

      for (const char of ambiguousChars) {
        expect(code).not.toContain(char);
      }
    });

    it('should generate different codes on multiple calls', () => {
      const codes = new Set();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        codes.add(generateRoomCode());
      }

      // With 6 characters from a 33-character set, collisions are very unlikely
      // We expect at least 95% unique codes
      expect(codes.size).toBeGreaterThan(iterations * 0.95);
    });

    it('should be all uppercase', () => {
      const code = generateRoomCode();
      expect(code).toBe(code.toUpperCase());
    });
  });

  describe('generatePlayerId', () => {
    it('should start with "player_" prefix', () => {
      const playerId = generatePlayerId();
      expect(playerId).toMatch(/^player_/);
    });

    it('should include a timestamp component', () => {
      const beforeTimestamp = Date.now();
      const playerId = generatePlayerId();
      const afterTimestamp = Date.now();

      // Extract timestamp from playerId (format: player_{timestamp}_{random})
      const timestampMatch = playerId.match(/^player_(\d+)_/);
      expect(timestampMatch).not.toBeNull();

      if (timestampMatch) {
        const timestamp = parseInt(timestampMatch[1]);
        expect(timestamp).toBeGreaterThanOrEqual(beforeTimestamp);
        expect(timestamp).toBeLessThanOrEqual(afterTimestamp);
      }
    });

    it('should include a random component', () => {
      const playerId = generatePlayerId();

      // Should have random part after timestamp (format: player_{timestamp}_{random})
      const parts = playerId.split('_');
      expect(parts).toHaveLength(3);
      expect(parts[2]).toHaveLength(7); // Random string is 7 characters
    });

    it('should generate unique IDs on multiple calls', () => {
      const ids = new Set();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        ids.add(generatePlayerId());
      }

      // All IDs should be unique
      expect(ids.size).toBe(iterations);
    });

    it('should only contain alphanumeric characters and underscores', () => {
      const playerId = generatePlayerId();
      expect(playerId).toMatch(/^[a-z0-9_]+$/);
    });
  });
});
