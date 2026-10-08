const GREETING_WORD: Record<'en' | 'fr', string> = {
  en: 'Hello',
  fr: 'Bonjour',
};

/** Returns an exclamatory "Hello, <name>!" greeting (or "Bonjour, <name>!" for `lang: 'fr'`); trims surrounding whitespace from `name`. */
export function greet(name: string, options?: { shout?: boolean; lang?: 'en' | 'fr' }): string {
  const greeting = `${GREETING_WORD[options?.lang ?? 'en']}, ${name.trim()}!`;
  return options?.shout ? greeting.toUpperCase() : greeting;
}
