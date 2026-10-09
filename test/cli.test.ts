import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const repoRoot = path.resolve(import.meta.dirname, '..');
const cliPath = path.join(repoRoot, 'dist', 'cli.js');

function runCli(args: string[]): { stdout: string; stderr: string; status: number } {
  const env = { ...process.env, NO_COLOR: '1' };
  try {
    const stdout = execFileSync(process.execPath, [cliPath, ...args], {
      cwd: repoRoot,
      encoding: 'utf8',
      env,
    });
    return { stdout, stderr: '', status: 0 };
  } catch (error) {
    const execError = error as { stdout?: string; stderr?: string; status?: number | null };
    return {
      stdout: execError.stdout ?? '',
      stderr: execError.stderr ?? '',
      status: execError.status ?? 1,
    };
  }
}

describe('playground-is CLI', () => {
  beforeAll(() => {
    execFileSync(path.join(repoRoot, 'node_modules', '.bin', 'tsc'), ['-p', 'tsconfig.build.json'], {
      cwd: repoRoot,
    });
  }, 30_000);

  it('AC1: "greet" with no --lang still prints the unchanged English greeting', () => {
    const { stdout, status } = runCli(['greet', 'Ada']);
    expect(stdout.trim()).toBe('Hello, Ada!');
    expect(status).toBe(0);
  });

  it('AC9: the pre-existing "hello" CLI behaviour is unchanged', () => {
    const { stdout, status } = runCli(['hello']);
    expect(stdout.trim()).toMatch(/^Hello, (world|earth|globe|planet|universe)!$/);
    expect(status).toBe(0);
  });

  it('AC2: "greet --lang fr" prints the French greeting', () => {
    const { stdout, status } = runCli(['greet', '--lang', 'fr', 'Ada']);
    expect(stdout.trim()).toBe('Bonjour, Ada!');
    expect(status).toBe(0);
  });

  it('AC5: "hello --lang fr" prints a fully French line with a French stand-in word', () => {
    const { stdout, status } = runCli(['hello', '--lang', 'fr']);
    expect(stdout.trim()).toMatch(/^Bonjour, (monde|terre|globe|planète|univers)!$/);
    expect(status).toBe(0);
  });

  it('AC7: the usage text mentions the --lang option', () => {
    const { stderr } = runCli([]);
    expect(stderr).toContain('--lang');
  });

  it('AC1: "farewell --lang it" prints an Italian farewell', () => {
    const { stdout, status } = runCli(['farewell', '--lang', 'it', 'Ada']);
    expect(stdout.trim()).toBe('Arrivederci, Ada!');
    expect(status).toBe(0);
  });

  it('AC2: "greet --lang pl" prints the Polish greeting', () => {
    const { stdout, status } = runCli(['greet', '--lang', 'pl', 'Ada']);
    expect(stdout.trim()).toBe('Cześć, Ada!');
    expect(status).toBe(0);
  });

  it('AC5: "hello --lang pl" prints a fully Polish line with a Polish stand-in word', () => {
    const { stdout, status } = runCli(['hello', '--lang', 'pl']);
    expect(stdout.trim()).toMatch(/^Cześć, (świat|ziemia|kula ziemska|planeta|wszechświat)!$/);
    expect(status).toBe(0);
  });

  it('AC7: the usage text mentions the pl value for --lang', () => {
    const { stderr } = runCli([]);
    expect(stderr).toContain('pl');
  });

  it('AC8: "farewell --lang pl" prints the Polish farewell, and "--lang it" / no option still print their existing unchanged text', () => {
    const polish = runCli(['farewell', '--lang', 'pl', 'Ada']);
    expect(polish.stdout.trim()).toBe('Do widzenia, Ada!');
    expect(polish.status).toBe(0);

    const italian = runCli(['farewell', '--lang', 'it', 'Ada']);
    expect(italian.stdout.trim()).toBe('Arrivederci, Ada!');
    expect(italian.status).toBe(0);

    const english = runCli(['farewell', 'Ada']);
    expect(english.stdout.trim()).toBe('Goodbye, Ada!');
    expect(english.status).toBe(0);
  });

  it('AC10: the farewell usage text mentions the pl value for --lang', () => {
    const { stderr } = runCli([]);
    expect(stderr).toContain('pl');
  });

  it('AC12: "greet --shout" prints the English greeting in upper case', () => {
    const { stdout, status } = runCli(['greet', '--shout', 'Ada']);
    expect(stdout.trim()).toBe('HELLO, ADA!');
    expect(status).toBe(0);
  });

  it('AC13: "greet --shout --lang fr" prints the French greeting in upper case', () => {
    const { stdout, status } = runCli(['greet', '--shout', '--lang', 'fr', 'Ada']);
    expect(stdout.trim()).toBe('BONJOUR, ADA!');
    expect(status).toBe(0);
  });

  it('AC14: "greet Ada --shout" parses --shout after the name too', () => {
    const { stdout, status } = runCli(['greet', 'Ada', '--shout']);
    expect(stdout.trim()).toBe('HELLO, ADA!');
    expect(status).toBe(0);
  });

  it('AC15: "hello --shout" prints the random stand-in greeting in upper case', () => {
    const { stdout, status } = runCli(['hello', '--shout']);
    expect(stdout.trim()).toMatch(/^HELLO, (WORLD|EARTH|GLOBE|PLANET|UNIVERSE)!$/);
    expect(status).toBe(0);
  });

  it('AC16: "hello --shout --lang pl" prints the Polish random stand-in greeting in upper case', () => {
    const { stdout, status } = runCli(['hello', '--shout', '--lang', 'pl']);
    expect(stdout.trim()).toMatch(/^CZEŚĆ, (ŚWIAT|ZIEMIA|KULA ZIEMSKA|PLANETA|WSZECHŚWIAT)!$/);
    expect(status).toBe(0);
  });

  it('AC17: "farewell --shout" does not upper-case (--shout only affects the greeting)', () => {
    const { stdout, status } = runCli(['farewell', '--shout', 'Ada']);
    expect(stdout.trim()).toBe('Goodbye, Ada!');
    expect(status).toBe(0);
  });

  it('AC18: "greet" without --shout is unchanged', () => {
    const { stdout, status } = runCli(['greet', 'Ada']);
    expect(stdout.trim()).toBe('Hello, Ada!');
    expect(status).toBe(0);
  });

  it('AC19: the usage text mentions the --shout option', () => {
    const { stderr } = runCli([]);
    expect(stderr).toContain('--shout');
  });
});
