import { describe, it, expect } from 'vitest';
import { pct } from '../math';

describe('math utilities', () => {
  describe('pct', () => {
    it('formats 0 correctly', () => {
      expect(pct(0)).toBe('0.0%');
    });

    it('formats a whole percentage correctly', () => {
      expect(pct(1)).toBe('100.0%');
    });

    it('formats a decimal correctly', () => {
      expect(pct(0.123)).toBe('12.3%');
      expect(pct(0.5)).toBe('50.0%');
    });

    it('rounds correctly due to IEEE 754 precision constraints', () => {
      expect(pct(0.1234)).toBe('12.3%');
      expect(pct(0.1235)).toBe('12.3%'); // Note: (0.1235*100) is 12.349999999999999645
    });

    it('handles negative numbers', () => {
      expect(pct(-0.1)).toBe('-10.0%');
    });
  });
});
