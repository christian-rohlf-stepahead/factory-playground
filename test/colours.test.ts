import { describe, expect, it } from 'vitest';
import { COLOURS, colourize, randomColour } from '../src/colours.js';

describe('randomColour', () => {
  it('picks a colour based on the given random source', () => {
    expect(randomColour(() => 0)).toBe('red');
    expect(randomColour(() => 0.4)).toBe('green');
    expect(randomColour(() => 0.9)).toBe('blue');
  });

  it('only ever returns a supported colour', () => {
    for (let i = 0; i < 100; i++) {
      expect(Object.keys(COLOURS)).toContain(randomColour());
    }
  });
});

describe('colourize', () => {
  it('wraps the text in the ANSI codes for the colour and resets afterwards', () => {
    expect(colourize('Hello', 'red')).toBe('\x1b[31mHello\x1b[0m');
  });
});
