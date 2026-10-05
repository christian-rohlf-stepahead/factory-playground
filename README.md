# factory-playground

A tiny TypeScript project for the software factory's acceptance test. The factory's
agent changes it on its own `factory/…` branch, and each change arrives here as a pull
request.

It is ESM, strict TypeScript on Node 22, tested with Vitest:

- `src/greet.ts`: one small module;
- `src/cli.ts`: the command line, an entry point to extend;
- `test/`: the Vitest tests.

## Build and test

```sh
npm ci
npm run build       # compiles src/ to dist/
npm run typecheck   # src/ and test/
npm test
```

## Run

```sh
node dist/cli.js greet Ada   # Hello, Ada!
node dist/cli.js hello       # Hello, <a random stand-in for "world">!
```

## CI

`.github/workflows/ci.yml` runs `npm ci`, `npm run build`, `npm run typecheck` and
`npm test` on every pull request and on every push to `main`.
