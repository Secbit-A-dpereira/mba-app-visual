import { describe, it, expect } from 'vitest';
import { safeDivide } from './math';

describe('math utilities', () => {
  describe('safeDivide', () => {
    it('should correctly divide two numbers', () => {
      expect(safeDivide(10, 2)).toEqual({ value: 5, isInfinite: false });
      expect(safeDivide(0, 5)).toEqual({ value: 0, isInfinite: false });
      expect(safeDivide(-10, 2)).toEqual({ value: -5, isInfinite: false });
    });

    it('should handle division by zero as an edge case', () => {
      expect(safeDivide(10, 0)).toEqual({ value: Infinity, isInfinite: true });
      expect(safeDivide(-10, 0)).toEqual({ value: Infinity, isInfinite: true });
    });
  });
});
