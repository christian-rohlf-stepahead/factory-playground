// The command line: node dist/cli.js <command> [arguments]. Add a command as one more case.
import pc from 'picocolors';
import { red } from 'kleur/colors';
import { greet } from './greet.js';
import { farewell } from './farewell.js';
import { randomWord, WORLD_WORDS_FR, WORLD_WORDS_PL } from './words.js';

const USAGE =
  'usage: node dist/cli.js greet <name> [--lang fr|pl] [--shout] | hello [--lang fr|pl] [--shout] | farewell <name> [--lang it|pl]';

function parseShout(args: string[]): { shout: boolean; rest: string[] } {
  const rest: string[] = [];
  let shout = false;
  for (const arg of args) {
    if (arg === '--shout') {
      shout = true;
    } else {
      rest.push(arg);
    }
  }
  return { shout, rest };
}

function parseLang<L extends string>(args: string[], allowed: readonly L[]): { lang: 'en' | L; rest: string[] } {
  const rest: string[] = [];
  let lang: 'en' | L = 'en';
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--lang') {
      i += 1;
      const value = args[i];
      lang = (allowed as readonly string[]).includes(value) ? (value as L) : 'en';
    } else {
      rest.push(args[i]);
    }
  }
  return { lang, rest };
}

const [command, ...rawArgs] = process.argv.slice(2);

switch (command) {
  case 'greet': {
    const { shout, rest: afterShout } = parseShout(rawArgs);
    const { lang, rest } = parseLang(afterShout, ['fr', 'pl'] as const);
    if (rest.length === 0) {
      console.error(red(USAGE));
      process.exitCode = 2;
    } else {
      console.log(pc.green(greet(rest.join(' '), { shout, lang })));
    }
    break;
  }
  case 'hello': {
    const { shout, rest: afterShout } = parseShout(rawArgs);
    const { lang } = parseLang(afterShout, ['fr', 'pl'] as const);
    const name = lang === 'fr' ? randomWord(WORLD_WORDS_FR) : lang === 'pl' ? randomWord(WORLD_WORDS_PL) : randomWord();
    console.log(pc.green(greet(name, { shout, lang })));
    break;
  }
  case 'farewell': {
    const { rest: afterShout } = parseShout(rawArgs);
    const { lang, rest } = parseLang(afterShout, ['it', 'pl'] as const);
    if (rest.length === 0) {
      console.error(red(USAGE));
      process.exitCode = 2;
    } else {
      console.log(pc.green(farewell(rest.join(' '), { lang })));
    }
    break;
  }
  default:
    console.error(red(USAGE));
    process.exitCode = 2;
}
