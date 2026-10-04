import { describe, expect, it } from 'vitest';
import { toRoman } from '../src/roman.js';

describe('toRoman', () => {
  it.each([
    [1, 'I'],
    [4, 'IV'],
    [9, 'IX'],
    [14, 'XIV'],
    [40, 'XL'],
    [90, 'XC'],
    [400, 'CD'],
    [1994, 'MCMXCIV'],
    [2024, 'MMXXIV'],
    [3999, 'MMMCMXCIX'],
  ])('converts %i to %s', (n, expected) => {
    expect(toRoman(n)).toBe(expected);
  });

  it('throws a RangeError for non-integers', () => {
    expect(() => toRoman(1.5)).toThrow(RangeError);
  });

  it('throws a RangeError for 0', () => {
    expect(() => toRoman(0)).toThrow(RangeError);
  });

  it('throws a RangeError for values above 3999', () => {
    expect(() => toRoman(4000)).toThrow(RangeError);
  });
});
