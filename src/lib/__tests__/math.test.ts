import { describe, it, expect } from 'vitest';
import { currency, pct, toCents, fromCents, safeDivide } from '../math';

describe('math utility functions', () => {
  describe('currency', () => {
    it('formats a number as EUR currency', () => {
      // Because we specify pt-PT locale, non-breaking space could be returned in some environments,
      // and comma is used for decimal.
      // Expected string typically ends with ' €'
      const formatted = currency(1234.56);
      expect(formatted).toMatch(/1\s?234,56\s?€/);
    });

    it('formats zero correctly', () => {
      const formatted = currency(0);
      expect(formatted).toMatch(/0,00\s?€/);
    });

    it('formats negative numbers correctly', () => {
      const formatted = currency(-50);
      expect(formatted).toMatch(/-50,00\s?€/);
    });
  });

  describe('pct', () => {
    it('formats decimal as percentage', () => {
      expect(pct(0.123)).toBe('12.3%');
      expect(pct(1)).toBe('100.0%');
      expect(pct(0.005)).toBe('0.5%');
    });

    it('handles zero', () => {
      expect(pct(0)).toBe('0.0%');
    });

    it('handles negative percentages', () => {
      expect(pct(-0.25)).toBe('-25.0%');
    });
  });

  describe('toCents', () => {
    it('converts euros to cents', () => {
      expect(toCents(12.34)).toBe(1234);
    });

    it('handles floating point precision issues', () => {
      // 0.58 * 100 = 57.99999999999999 in JS normally, Math.round should fix
      expect(toCents(0.58)).toBe(58);
    });
  });

  describe('fromCents', () => {
    it('converts cents to euros', () => {
      expect(fromCents(1234)).toBe(12.34);
    });
  });

  describe('safeDivide', () => {
    it('divides numbers correctly', () => {
      expect(safeDivide(10, 2)).toEqual({ value: 5, isInfinite: false });
      expect(safeDivide(0, 5)).toEqual({ value: 0, isInfinite: false });
    });

    it('handles division by zero', () => {
      expect(safeDivide(10, 0)).toEqual({ value: Infinity, isInfinite: true });
    });

    it('handles division of zero by zero', () => {
      expect(safeDivide(0, 0)).toEqual({ value: Infinity, isInfinite: true });
    });

    it('handles negative division by zero', () => {
      // It returns Infinity, not -Infinity, because the function is:
      // if (b === 0) return { value: Infinity, isInfinite: true };
      expect(safeDivide(-10, 0)).toEqual({ value: Infinity, isInfinite: true });
    });
  });
});
