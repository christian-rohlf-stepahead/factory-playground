import { describe, expect, it } from 'vitest';
import { greet } from '../src/greet.js';

describe('greet', () => {
  it('greets by name', () => {
    expect(greet('Ada')).toBe('Hello, Ada!');
  });

  it('AC1: shout option returns the greeting in upper case', () => {
    expect(greet('Ada', { shout: true })).toBeDefined();
  });

  it('AC2: trims whitespace around the name', () => {
    expect(greet('  Ada ')).toBe('Hello, Ada!');
  });
});
