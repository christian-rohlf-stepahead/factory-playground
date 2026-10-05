/** Words that can stand in for "world" in a greeting. */
export const WORLD_WORDS = ['world', 'earth', 'globe', 'planet', 'universe'] as const;

/** A random pick from `words`. */
export function randomWord(words: readonly string[] = WORLD_WORDS): string {
  return words[Math.floor(Math.random() * words.length)];
}
