const GREETING_WORD: Partial<Record<'en' | 'fr' | 'pl', string>> = {
  en: 'Hello',
  fr: 'Bonjour',
  pl: 'Cześć',
};

/** Returns an exclamatory "Hello, <name>!" greeting (or "Bonjour, <name>!" for `lang: 'fr'`, "Cześć, <name>!" for `lang: 'pl'`); trims surrounding whitespace from `name`. */
export function greet(name: string, options?: { shout?: boolean; lang?: 'en' | 'fr' | 'pl' }): string {
  const greeting = `${GREETING_WORD[options?.lang ?? 'en'] ?? GREETING_WORD.en}, ${name.trim()}!`;
  return options?.shout ? greeting.toUpperCase() : greeting;
}
