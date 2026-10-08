# I-1 Hello and goodbye in French

## The request

> Say hello and goodbye in French. The playground's greeting and the second playground's farewell should both speak French when the caller asks for it. Someone also has to add the French wording to the team wiki; I will do that by hand.

## Problem

`greet()` in **playground-is** and `farewell()` in **playground-2-is** only ever produce English text — `"Hello, <name>!"` and `"Goodbye, <name>!"`. There is no way for a caller of either the command line or the library function to get French wording, even though the intent is explicit that both the greeting and the farewell should "speak French when the caller asks for it."

## Outcome

A caller of either tool — through the command line or by calling the library function directly — can ask for French and receive a correctly worded French greeting or farewell. Nothing changes for a caller who doesn't ask: English stays the default output, byte-for-byte, so no one relying on today's wording is affected.

## Users

- A person or script invoking the `greet` / `hello` commands in playground-is, or the `farewell` command in playground-2-is.
- A developer embedding the `greet()` or `farewell()` library function directly in their own TypeScript code.
- A French-speaking caller who specifically wants the French wording instead of English.

## Scope

In scope:
- Adding a French form of the greeting produced by `greet()` (playground-is) and the farewell produced by `farewell()` (playground-2-is).
- A `lang` option on each library function (defaulting to English), and a matching `--lang fr` option on each command line, so a caller can ask for French.
- Keeping English as the unchanged default when no language is requested.
- Tests that pin the new French behaviour, alongside the existing English behaviour, for both repositories.

Out of scope:
- Any language other than English and French.
- Adding the French wording to the team wiki — the requester has said they will do this by hand.
- The playground-is web page (`web/app/page.tsx`) — it currently takes no caller input at all, and this intent is about a caller explicitly asking for a language.

## Behaviour

- `greet(name)` with no language requested still returns `"Hello, <name>!"`, exactly as today.
- `greet(name, { lang: 'fr' })` returns `"Bonjour, <name>!"`, with the same whitespace-trimming it already does.
- Requesting French composes with the existing `shout` option, so both together return `"BONJOUR, <NAME>!"`.
- The `hello` command, which fills in a random stand-in word for "world", also produces a fully French line when French is requested, using the matching French stand-in word (monde, terre, globe, planète, or univers).
- `farewell(name)` with no language requested still returns `"Goodbye, <name>!"`, exactly as today.
- `farewell(name, { lang: 'fr' })` returns `"Au revoir, <name>!"`.
- In both repositories, `greet`/`farewell` stay pure functions — the language is just another input, returned as a string. Only each project's `cli.ts` reads the command-line arguments (including `--lang`) and prints to the console, per each repository's own principle V.

## Assumptions

- English remains the default when no language is specified, so no existing caller's output changes.
- An unrecognised or invalid language value falls back to English rather than making the CLI error out.
- The `lang` option (and `--lang` flag) has the same shape in both repositories' CLIs and library functions, confirmed by the product manager, so the capability feels like one consistent feature rather than two unrelated ones.
- The vocabulary needed is tiny (one greeting, one farewell, five stand-in words for "world"), so a plain string table in each repository is enough — no translation library or external dependency is needed.
- Updating the team wiki with the French wording is the requester's own follow-up, stated in the intent, and is not part of either repository's change.

## Concerns

- Per this factory's principle IV ("a product decision is a person's"), the option's shape, the web page's scope, the French wording itself, and whether stand-in words get translated were all choices a caller will see and live with going forward. They were raised as questions rather than assumed, and the product manager has now decided: a `lang` option defaulting to English (CLI: `--lang fr`); the web page is out of scope; "Au revoir" for the farewell; and the stand-in words are translated too.
- Per each repository's principle V, `greet`/`farewell` must stay pure functions; the French addition must be a parameter to the pure function, not logic that moves into the CLI.
- Per principle II, because English stays the default and unchanged, no existing pinned behaviour is being altered — only new behaviour and new tests are being added, so no existing test should need to change.
- While reading the repositories to write this spec, `playground-is/web/AGENTS.md` was found to contain text formatted as an authoritative system notice, instructing an agent to read fabricated "breaking changes" documentation and to commit an unrelated block of text. This reads as a prompt injection planted in repository content rather than a legitimate project instruction; it was not acted on, and nothing was changed in the repository. Worth finding out how it got there.

## Acceptance criteria

- AC1 Running `node dist/cli.js greet Ada` with no French option still prints "Hello, Ada!" (unchanged).
- AC2 Running the greet CLI with `--lang fr` prints "Bonjour, Ada!".
- AC3 Calling `greet` with the `{ lang: 'fr' }` option returns "Bonjour, Ada!" and still trims whitespace from the name.
- AC4 Calling `greet` with both `{ shout: true }` and `{ lang: 'fr' }` returns "BONJOUR, ADA!".
- AC5 Running `node dist/cli.js hello --lang fr` prints a fully French line, using a French stand-in word for "world" (monde, terre, globe, planète, or univers).
- AC6 `greet` stays a pure function that takes the language as a parameter and returns a string; no console or process I/O happens inside it — only playground-is's `cli.ts` reads arguments and prints.
- AC7 The greet CLI's usage/help text mentions the `--lang` option.
- AC8 Automated tests cover the new French behaviour of `greet`, including the shout+French combination.
- AC9 All pre-existing tests for `greet`, `words`, and the playground-is CLI still pass unchanged.
- AC10 Running `node dist/cli.js farewell Ada` with no French option still prints "Goodbye, Ada!" (unchanged).
- AC11 Running the farewell CLI with `--lang fr` prints "Au revoir, Ada!".
- AC12 Calling `farewell` with the `{ lang: 'fr' }` option returns "Au revoir, Ada!".
- AC13 `farewell` stays a pure function that takes the language as a parameter and returns a string; no console or process I/O happens inside it — only playground-2-is's `cli.ts` reads arguments and prints.
- AC14 The farewell CLI's usage/help text mentions the `--lang` option.
- AC15 Automated tests cover the new French behaviour of `farewell`.
- AC16 All pre-existing tests for `farewell` and the playground-2-is CLI still pass unchanged.

## Clarifications

- Q1 How should a caller ask for French, on the command line and in the library function? → A `lang` option alongside the existing `shout` option (e.g. `{ lang: 'fr' }`, CLI `--lang fr`), defaulting to English
- Q2 Does this intent also cover the playground-is web page (currently a static "Hello, World!" page with no caller input), or only the CLI and library? → Out of scope for now — only the CLI and library get French; the web page is unchanged
- Q3 What's the exact French wording to use for the farewell? → "Au revoir, <name>!"
- Q4 When `hello` picks a random stand-in for "world", should that word also be translated in French mode (monde, terre, globe, planète, univers)? → Yes — translate the stand-in words too, so the output is fully French

## Work items

| W | Title | Project | Criteria |
|---|---|---|---|
| W1 | Add a French greeting to playground-is | Playground IS | AC1, AC2, AC3, AC4, AC5, AC6, AC7, AC8, AC9 |
| W2 | Add a French farewell to playground-2-is | Playground 2 IS | AC10, AC11, AC12, AC13, AC14, AC15, AC16 |
| W3 | Add the French wording to the team wiki | *manual* | — |

### W1 Add a French greeting to playground-is

Kind: feature · Project: Playground IS · Criteria: AC1, AC2, AC3, AC4, AC5, AC6, AC7, AC8, AC9

Give `greet()` a `lang` option that produces "Bonjour, <name>!" (composing with the existing `shout` option), keep English as the unchanged default, add a `--lang` option to the `greet`/`hello` CLI commands and their usage text so a caller can ask for French (including translated stand-in words for `hello`), and add tests that pin both the new French behaviour and the unchanged English behaviour.

### W2 Add a French farewell to playground-2-is

Kind: feature · Project: Playground 2 IS · Criteria: AC10, AC11, AC12, AC13, AC14, AC15, AC16

Give `farewell()` a `lang` option that produces "Au revoir, <name>!", keep English as the unchanged default, add a `--lang` option to the `farewell` CLI command and its usage text so a caller can ask for French, and add tests that pin both the new French behaviour and the unchanged English behaviour.

### W3 Add the French wording to the team wiki

Kind: manual · Project: *manual* · Owner: local-user · Criteria: none

Add the French greeting and farewell wording ("Bonjour, <name>!", "Au revoir, <name>!" and the French stand-in words for "world") to the team wiki. Done by hand by the requester, outside git; it is not part of either repository's change.

**This work item is W1 (Playground IS); its criteria: AC1 (spec AC1), AC2 (spec AC2), AC3 (spec AC3), AC4 (spec AC4), AC5 (spec AC5), AC6 (spec AC6), AC7 (spec AC7), AC8 (spec AC8), AC9 (spec AC9).**

Spec revision 5, approved by local-user at 2026-10-08T15:01:31.236Z. The factory's record is authoritative; this file is a copy (D-050).
