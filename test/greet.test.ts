import { describe, expect, it, vi } from 'vitest';
import { greet } from '../src/greet.js';

describe('greet', () => {
  it('greets by name', () => {
    expect(greet('Ada')).toBe('Hello, Ada!');
  });

  it('AC1: shout option returns the greeting in upper case', () => {
    expect(greet('Ada', { shout: true })).toBe('HELLO, ADA!');
  });

  it('AC2: trims whitespace around the name', () => {
    expect(greet('  Ada ')).toBe('Hello, Ada!');
  });

  it('AC3: lang "fr" option returns a French greeting and still trims whitespace', () => {
    expect(greet('  Ada ', { lang: 'fr' })).toBe('Bonjour, Ada!');
  });

  it('AC4/AC8: shout composes with lang "fr" to return an upper-case French greeting', () => {
    expect(greet('Ada', { shout: true, lang: 'fr' })).toBe('BONJOUR, ADA!');
  });

  it('AC6: performs no console or process I/O and only returns a string', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    const result = greet('Ada', { lang: 'fr' });

    expect(typeof result).toBe('string');
    expect(logSpy).not.toHaveBeenCalled();
    expect(writeSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
    writeSpy.mockRestore();
  });
});
