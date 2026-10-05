/** ANSI escape codes for the supported colours. */
export const COLOURS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
} as const;

const RESET = '\x1b[0m';

export type Colour = keyof typeof COLOURS;

/** Picks one of the supported colours at random. */
export function randomColour(random: () => number = Math.random): Colour {
  const names = Object.keys(COLOURS) as Colour[];
  const index = Math.floor(random() * names.length);
  return names[index];
}

/** Wraps `text` in the ANSI escape codes for `colour`. */
export function colourize(text: string, colour: Colour): string {
  return `${COLOURS[colour]}${text}${RESET}`;
}
