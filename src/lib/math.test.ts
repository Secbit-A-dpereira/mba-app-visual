import { describe, it, expect } from 'vitest';
import { calcSevenSAlignment } from './math';

describe('calcSevenSAlignment', () => {
  it('should calculate the correct average and identify weak nodes', () => {
    const input = {
      strategy: 5,
      structure: 3,
      systems: 4,
      sharedValues: 2,
      style: 5,
      staff: 5,
      skills: 4,
    };
    const result = calcSevenSAlignment(input);
    expect(result.averageAlignment).toBe(28 / 7); // 4
    expect(result.weakNodes).toEqual(['structure', 'sharedValues']);
  });

  it('should handle all strong nodes (no weak nodes)', () => {
    const input = {
      node1: 5,
      node2: 4,
      node3: 5,
    };
    const result = calcSevenSAlignment(input);
    expect(result.averageAlignment).toBe(14 / 3);
    expect(result.weakNodes).toEqual([]);
  });

  it('should handle all weak nodes', () => {
    const input = {
      node1: 3,
      node2: 2,
      node3: 1,
    };
    const result = calcSevenSAlignment(input);
    expect(result.averageAlignment).toBe(6 / 3); // 2
    expect(result.weakNodes).toEqual(['node1', 'node2', 'node3']);
  });

  it('should handle an empty object', () => {
    const input = {};
    const result = calcSevenSAlignment(input);
    expect(result.averageAlignment).toBeNaN();
    expect(result.weakNodes).toEqual([]);
  });
});
