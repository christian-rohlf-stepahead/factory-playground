const FAREWELL_WORD: Partial<Record<'en' | 'it' | 'pl', string>> = {
  en: 'Goodbye',
  it: 'Arrivederci',
};

/** Returns a "Goodbye, <name>!" farewell (or an Italian farewell for `lang: 'it'`); trims surrounding whitespace from `name`. */
export function farewell(name: string, options?: { lang?: 'en' | 'it' | 'pl' }): string {
  return `${FAREWELL_WORD[options?.lang ?? 'en'] ?? FAREWELL_WORD.en}, ${name.trim()}!`;
}
