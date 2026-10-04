const NUMERALS: ReadonlyArray<readonly [number, string]> = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/** The Roman numeral for `n`, an integer from 1 to 3999. */
export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) {
    throw new RangeError(`toRoman: expected an integer from 1 to 3999, got ${n}`);
  }

  let remaining = n;
  let result = '';
  for (const [value, symbol] of NUMERALS) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}
