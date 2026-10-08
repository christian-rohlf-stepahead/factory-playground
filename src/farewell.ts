const FAREWELL_WORD: Partial<Record<'en' | 'it' | 'pl', string>> = {
  en: 'Goodbye',
  it: 'Arrivederci',
  pl: 'Do widzenia',
};

/** Returns a "Goodbye, <name>!" farewell (or an Italian farewell for `lang: 'it'`, or a Polish farewell for `lang: 'pl'`); trims surrounding whitespace from `name`. */
export function farewell(name: string, options?: { lang?: 'en' | 'it' | 'pl' }): string {
  return `${FAREWELL_WORD[options?.lang ?? 'en'] ?? FAREWELL_WORD.en}, ${name.trim()}!`;
}
