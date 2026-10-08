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

  it('AC4: shout composes with lang "fr" to return an upper-case French greeting', () => {
    expect(greet('Ada', { shout: true, lang: 'fr' })).toBe('BONJOUR, ADA!');
  });

  it('AC8: French behaviour is covered in both normal and shout form', () => {
    expect(greet('Ada', { lang: 'fr' })).toBe('Bonjour, Ada!');
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

  it('AC3: lang "pl" option returns a Polish greeting and still trims whitespace', () => {
    expect(greet('  Ada ', { lang: 'pl' })).toBe('Cześć, Ada!');
  });

  it('AC4: shout composes with lang "pl" to return an upper-case Polish greeting', () => {
    expect(greet('Ada', { shout: true, lang: 'pl' })).toBe('CZEŚĆ, ADA!');
  });

  it('AC6: performs no console or process I/O and only returns a string when asked for Polish', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    const result = greet('Ada', { lang: 'pl' });

    expect(typeof result).toBe('string');
    expect(logSpy).not.toHaveBeenCalled();
    expect(writeSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
    writeSpy.mockRestore();
  });

  it('AC11: Polish greet behaviour is covered in both normal and shout form, alongside the unchanged English and French behaviour', () => {
    expect(greet('Ada')).toBe('Hello, Ada!');
    expect(greet('Ada', { lang: 'fr' })).toBe('Bonjour, Ada!');
    expect(greet('Ada', { lang: 'pl' })).toBe('Cześć, Ada!');
    expect(greet('Ada', { shout: true, lang: 'pl' })).toBe('CZEŚĆ, ADA!');
  });
});
