// The command line: node dist/cli.js <command> [arguments]. Add a command as one more case.
import { greet } from './greet.js';
import { toRoman } from './roman.js';

const USAGE = 'usage: node dist/cli.js greet <name>\n   or: node dist/cli.js roman <n>';

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'greet':
    if (args.length === 0) {
      console.error(USAGE);
      process.exitCode = 2;
    } else {
      console.log(greet(args.join(' ')));
    }
    break;
  case 'roman':
    if (args.length === 0) {
      console.error(USAGE);
      process.exitCode = 2;
    } else {
      try {
        console.log(toRoman(Number(args[0])));
      } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      }
    }
    break;
  default:
    console.error(USAGE);
    process.exitCode = 2;
}
