// The command line: node dist/cli.js <command> [arguments]. Add a command as one more case.
import pc from 'picocolors';
import { red } from 'kleur/colors';
import { greet } from './greet.js';
import { randomWord, WORLD_WORDS_FR } from './words.js';

const USAGE = 'usage: node dist/cli.js greet <name> [--lang fr] | hello [--lang fr]';

function parseLang(args: string[]): { lang: 'en' | 'fr'; rest: string[] } {
  const rest: string[] = [];
  let lang: 'en' | 'fr' = 'en';
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--lang') {
      i += 1;
      lang = args[i] === 'fr' ? 'fr' : 'en';
    } else {
      rest.push(args[i]);
    }
  }
  return { lang, rest };
}

const [command, ...rawArgs] = process.argv.slice(2);

switch (command) {
  case 'greet': {
    const { lang, rest } = parseLang(rawArgs);
    if (rest.length === 0) {
      console.error(red(USAGE));
      process.exitCode = 2;
    } else {
      console.log(pc.green(greet(rest.join(' '), { lang })));
    }
    break;
  }
  case 'hello': {
    const { lang } = parseLang(rawArgs);
    const name = lang === 'fr' ? randomWord(WORLD_WORDS_FR) : randomWord();
    console.log(pc.green(greet(name, { lang })));
    break;
  }
  default:
    console.error(red(USAGE));
    process.exitCode = 2;
}
