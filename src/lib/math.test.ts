import { describe, it, expect } from 'vitest';
import { calcVRIOImplication } from './math';

describe('calcVRIOImplication', () => {
  it('returns Competitive Disadvantage when not valuable', () => {
    const result = calcVRIOImplication({
      valuable: false,
      rare: true,
      inimitable: true,
      organized: true,
    });
    expect(result).toBe('Competitive Disadvantage');
  });

  it('returns Competitive Parity when valuable but not rare', () => {
    const result = calcVRIOImplication({
      valuable: true,
      rare: false,
      inimitable: true,
      organized: true,
    });
    expect(result).toBe('Competitive Parity');
  });

  it('returns Temporary Advantage when valuable and rare but not inimitable', () => {
    const result = calcVRIOImplication({
      valuable: true,
      rare: true,
      inimitable: false,
      organized: true,
    });
    expect(result).toBe('Temporary Advantage');
  });

  it('returns Temporary Advantage (unused) when valuable, rare, inimitable but not organized', () => {
    const result = calcVRIOImplication({
      valuable: true,
      rare: true,
      inimitable: true,
      organized: false,
    });
    expect(result).toBe('Temporary Advantage (unused)');
  });

  it('returns Sustained Competitive Advantage when all conditions are met', () => {
    const result = calcVRIOImplication({
      valuable: true,
      rare: true,
      inimitable: true,
      organized: true,
    });
    expect(result).toBe('Sustained Competitive Advantage');
  });
});
