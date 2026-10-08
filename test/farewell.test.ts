import { describe, expect, it } from 'vitest';
import { farewell } from '../src/farewell.js';

describe('farewell', () => {
  it('AC1: lang "it" option returns an Italian farewell', () => {
    expect(farewell('Ada', { lang: 'it' })).toBe('Arrivederci, Ada!');
  });

  it('AC9: lang "pl" option returns the Polish farewell', () => {
    expect(farewell('Ada', { lang: 'pl' })).toBe('Do widzenia, Ada!');
  });

  it('AC11: Polish farewell behaviour is covered, alongside the unchanged English and Italian behaviour', () => {
    expect(farewell('Ada')).toBe('Goodbye, Ada!');
    expect(farewell('Ada', { lang: 'it' })).toBe('Arrivederci, Ada!');
    expect(farewell('Ada', { lang: 'pl' })).toBe('Do widzenia, Ada!');
  });
});
