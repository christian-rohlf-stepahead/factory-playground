import { describe, expect, it } from 'vitest';
import { farewell } from '../src/farewell.js';

describe('farewell', () => {
  it('AC1: lang "it" option returns an Italian farewell', () => {
    expect(farewell('Ada', { lang: 'it' })).toBe('Arrivederci, Ada!');
  });
});
