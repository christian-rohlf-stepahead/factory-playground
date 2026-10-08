const FAREWELL_WORD: Record<'en' | 'it', string> = {
  en: 'Goodbye',
  it: 'Goodbye',
};

/** Returns a "Goodbye, <name>!" farewell (or an Italian farewell for `lang: 'it'`); trims surrounding whitespace from `name`. */
export function farewell(name: string, options?: { lang?: 'en' | 'it' }): string {
  return `${FAREWELL_WORD[options?.lang ?? 'en']}, ${name.trim()}!`;
}
