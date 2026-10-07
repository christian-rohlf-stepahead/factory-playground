/** Returns an exclamatory "Hello, <name>!" greeting; does not validate or sanitize `name`. */
export function greet(name: string, options?: { shout?: boolean }): string {
  return `Hello, ${name}!`;
}
