import { describe, it, expect } from 'vitest';
import { fromCents } from './math';

describe('fromCents', () => {
  it('should convert positive cents to standard units', () => {
    expect(fromCents(100)).toBe(1);
    expect(fromCents(250)).toBe(2.5);
    expect(fromCents(999)).toBe(9.99);
  });

  it('should handle zero correctly', () => {
    expect(fromCents(0)).toBe(0);
  });

  it('should convert negative cents to negative standard units', () => {
    expect(fromCents(-100)).toBe(-1);
    expect(fromCents(-50)).toBe(-0.5);
  });

  it('should handle floating point precision correctly for small values', () => {
    expect(fromCents(1)).toBe(0.01);
    expect(fromCents(-1)).toBe(-0.01);
  });
});
