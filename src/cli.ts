// The command line: node dist/cli.js <command> [arguments]. Add a command as one more case.
import { greet } from './greet.js';

const USAGE = 'usage: node dist/cli.js greet <name>';

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
  default:
    console.error(USAGE);
    process.exitCode = 2;
}
