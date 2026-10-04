# Instructions for the agent

This is a tiny TypeScript project: ESM, strict, Node 22. The code is in `src/`, the
Vitest tests are in `test/`, and `src/cli.ts` is the command line.

- Run `npm ci` once, before your first change.
- After each change, run `npm test` and `npm run typecheck`, and keep both green.
- Import local modules with the `.js` extension, for example `./greet.js`.
- Do not edit `.github/`: the CI workflow is not part of your task.
- Do not commit `node_modules/` or `dist/`; `.gitignore` keeps them out.
- When the work is done, commit it with a clear message.
