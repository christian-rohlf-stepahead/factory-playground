/** Returns an exclamatory "Hello, <name>!" greeting; trims surrounding whitespace from `name`. */
export function greet(name: string, options?: { shout?: boolean; lang?: 'en' | 'fr' }): string {
  const greeting = `Hello, ${name.trim()}!`;
  return options?.shout ? greeting.toUpperCase() : greeting;
}
