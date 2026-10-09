# CLI --shout Flag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `--shout` flag to the CLI so the greeting is printed in upper case.

**Architecture:** `greet()` in `src/greet.ts` already accepts a `shout` option and returns an
upper-cased string (added in #9, covered by `test/greet.test.ts`). The CLI never wires it up.
This plan only touches `src/cli.ts`: parse `--shout` alongside the existing `--lang` parsing and
pass `shout: true` into `greet()` for the `greet` and `hello` subcommands.

**Tech Stack:** TypeScript (ESM, strict), Vitest, Node 22's built-in `node:child_process` for the
CLI's black-box tests.

**Spec:** The work item's prompt: "Add a `--shout` flag to the CLI: with it, the greeting is
printed in upper case. Leave the docs alone." There is no further spec document and no person to
ask follow-up questions of in this run, so this plan records the product decisions needed to fill
the gaps the prompt leaves open.

**Decisions made in place of a design doc (no person available to ask):**
- **Scope — `greet` and `hello` only, not `farewell`.** The prompt says "the greeting", and only
  `greet`/`hello` build their output through `greet()`. `farewell()` has no `shout` option and
  producing a farewell is not "the greeting". Adding shout support to `farewell` would be a second,
  unasked-for feature (and a change to a currently-untouched pure function), so it's out of scope.
- **Flag shape — a bare boolean switch, `--shout`, with no value.** It mirrors `--lang`'s syntax
  family but takes no argument, matching how `shout` is already a boolean in `greet()`'s options
  type. No negative form (`--no-shout`) since nothing asked for one and it is not the default.
- **Docs — left alone, verbatim per the prompt.** `README.md`'s Run section and the `USAGE` string
  in `src/cli.ts` keep their current text. (This intentionally leaves the documentation review
  item "not met" for this change — the prompt overrides it explicitly.)

## Global Constraints

- Leave `README.md` and the CLI's `USAGE` usage text unchanged — the prompt says "leave the docs
  alone".
- `src/greet.ts` stays untouched: it is already a pure function with the needed `shout` option
  (Principle V: "The greeting stays a pure function; only the CLI does input and output").
- Import local modules with the `.js` extension.
- `npm test` and `npm run typecheck` must stay green after the change.

## Review Focus

- `--shout` combined with `--lang fr`/`--lang pl` on `greet` — must upper-case the translated
  greeting, not silently ignore shout or lang.
- `hello --shout` — must upper-case the randomly chosen stand-in word's greeting, across all
  languages, not just the no-flag case.
- `--shout` in any position relative to the name/`--lang` arguments (e.g. `greet --shout Ada` vs
  `greet Ada --shout`) — must parse correctly regardless of order, matching how `--lang` already
  tolerates reordering.
- `farewell --shout` — must NOT upper-case (out of scope per the decision above); confirms the
  boundary was actually drawn, not just unimplemented by accident.
- Plain `greet`/`hello` with no `--shout` — must remain byte-identical to current output (no
  regression for the unflagged path).

---

## Task 1: Wire `--shout` into the CLI's `greet` and `hello` commands

**Files:**
- Modify: `src/cli.ts`
- Test: `test/cli.test.ts`

**Interfaces:**
- Consumes: `greet(name: string, options?: { shout?: boolean; lang?: 'en' | 'fr' | 'pl' })` from
  `src/greet.ts` (already exists, unchanged).
- Produces: nothing new for later tasks — this is the only task in the plan.

- [ ] **Step 1: Write the failing CLI tests**

Add these cases to `test/cli.test.ts`, inside the existing `describe('playground-is CLI', ...)`
block (after the existing `AC11`/last test — name them `AC12`+ to continue the file's numbering):

```ts
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
```

- [ ] **Step 2: Run the tests to verify the new ones fail**

Run: `npm test`
Expected: AC12, AC13, AC14, AC15, AC16 FAIL (stdout still lower case because `--shout` is parsed
as a positional argument today, corrupting the name/word). AC17 and AC18 already PASS (they
describe current behaviour) — that's fine, they stay as regression guards.

- [ ] **Step 3: Implement `--shout` parsing in `src/cli.ts`**

Add a small helper next to `parseLang`, and call it for the `greet` and `hello` cases only:

```ts
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
```

Update the `greet` case to run both parsers (order doesn't matter since each only pulls its own
flag out) and pass `shout` through:

```ts
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
```

Update the `hello` case the same way:

```ts
  case 'hello': {
    const { shout, rest: afterShout } = parseShout(rawArgs);
    const { lang } = parseLang(afterShout, ['fr', 'pl'] as const);
    const name = lang === 'fr' ? randomWord(WORLD_WORDS_FR) : lang === 'pl' ? randomWord(WORLD_WORDS_PL) : randomWord();
    console.log(pc.green(greet(name, { shout, lang })));
    break;
  }
```

Leave the `farewell` case untouched — `--shout` is not parsed out of its args, so a stray
`--shout` flows into `rest` and becomes part of the joined name... which would break AC17.
Instead, strip `--shout` there too but discard it (so it's accepted and ignored rather than
treated as part of the name):

```ts
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
```

- [ ] **Step 4: Run the tests to verify everything passes**

Run: `npm test`
Expected: all tests PASS, including AC12–AC18.

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/cli.ts test/cli.test.ts docs/superpowers/plans/2026-10-09-cli-shout-flag.md
git commit -m "feat(cli): add --shout flag to greet and hello commands"
```
