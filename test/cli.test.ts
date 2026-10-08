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
});
