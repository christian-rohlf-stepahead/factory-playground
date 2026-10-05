import { describe, expect, it, vi } from 'vitest';
import { randomWord, WORLD_WORDS } from '../src/words.js';

describe('randomWord', () => {
  it('returns one of the known words', () => {
    expect(WORLD_WORDS).toContain(randomWord());
  });

  it('picks the word at the random index', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(randomWord(['a', 'b', 'c', 'd'])).toBe('c');
    vi.restoreAllMocks();
  });
});
