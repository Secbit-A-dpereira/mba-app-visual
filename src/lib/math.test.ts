import { describe, it, expect } from 'vitest';
import { toCents, fromCents } from './math';

describe('math utilities', () => {
  describe('toCents', () => {
    it('should convert euros to cents correctly', () => {
      expect(toCents(10)).toBe(1000);
      expect(toCents(10.5)).toBe(1050);
      expect(toCents(10.55)).toBe(1055);
    });

    it('should handle floating point inaccuracies', () => {
      // 19.99 * 100 in JS is 1998.9999999999998
      // Math.round should make it 1999
      expect(toCents(19.99)).toBe(1999);
    });

    it('should handle rounding correctly', () => {
      expect(toCents(10.555)).toBe(1056);
      expect(toCents(10.554)).toBe(1055);
    });

    it('should handle zero', () => {
      expect(toCents(0)).toBe(0);
      expect(toCents(-0)).toBe(-0);
    });

    it('should handle negative numbers', () => {
      expect(toCents(-10.5)).toBe(-1050);
    });
  });

  describe('fromCents', () => {
    it('should convert cents to euros correctly', () => {
      expect(fromCents(1000)).toBe(10);
      expect(fromCents(1050)).toBe(10.5);
      expect(fromCents(1055)).toBe(10.55);
    });

    it('should handle zero', () => {
      expect(fromCents(0)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(fromCents(-1050)).toBe(-10.5);
    });
  });
});
