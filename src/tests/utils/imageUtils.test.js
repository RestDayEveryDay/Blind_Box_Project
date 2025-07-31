import { describe, it, expect } from 'vitest';
import { processImageUrl, generatePlaceholder } from '../utils/imageUtils';

describe('imageUtils', () => {
  describe('processImageUrl', () => {
    it('should return empty string for null/undefined input', () => {
      expect(processImageUrl(null)).toBe('');
      expect(processImageUrl(undefined)).toBe('');
      expect(processImageUrl('')).toBe('');
    });

    it('should convert localhost absolute URL to relative path', () => {
      const input = 'http://localhost:3001/images/items/test.jpg';
      const expected = '/images/items/test.jpg';
      expect(processImageUrl(input)).toBe(expected);
    });

    it('should return relative path as-is when correctly formatted', () => {
      const input = '/images/items/test.jpg';
      expect(processImageUrl(input)).toBe(input);
    });

    it('should add leading slash to relative path without it', () => {
      const input = 'images/items/test.jpg';
      const expected = '/images/items/test.jpg';
      expect(processImageUrl(input)).toBe(expected);
    });

    it('should handle HTTP/HTTPS URLs correctly', () => {
      const httpUrl = 'http://example.com/image.jpg';
      const httpsUrl = 'https://example.com/image.jpg';
      expect(processImageUrl(httpUrl)).toBe(httpUrl);
      expect(processImageUrl(httpsUrl)).toBe(httpsUrl);
    });

    it('should add /images/ prefix for unknown formats', () => {
      const input = 'test.jpg';
      const expected = '/images/test.jpg';
      expect(processImageUrl(input)).toBe(expected);
    });
  });

  describe('generatePlaceholder', () => {
    it('should generate a valid data URL', () => {
      const result = generatePlaceholder(100, 100, 'Test');
      expect(result).toMatch(/^data:image\/png;base64,/);
    });

    it('should handle custom dimensions', () => {
      const result = generatePlaceholder(200, 300, 'Custom');
      expect(result).toMatch(/^data:image\/png;base64,/);
    });
  });
});