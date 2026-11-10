const FRACTIONS: [number, string][] = [
  [0, ''],
  [1 / 8, '⅛'],
  [1 / 4, '¼'],
  [1 / 3, '⅓'],
  [3 / 8, '⅜'],
  [1 / 2, '½'],
  [5 / 8, '⅝'],
  [2 / 3, '⅔'],
  [3 / 4, '¾'],
  [7 / 8, '⅞'],
  [1, '']
];

const METRIC = new Set(['g', 'kg', 'ml', 'l', 'mL', 'L']);

const PLURALS: Record<string, string> = {
  cup: 'cups',
  clove: 'cloves',
  stick: 'sticks',
  can: 'cans',
  pinch: 'pinches',
  package: 'packages',
  slice: 'slices',
  sprig: 'sprigs',
  pound: 'pounds',
  ounce: 'ounces',
  quart: 'quarts',
  pint: 'pints',
  sheet: 'sheets'
};

/** Formats a number as a kitchen amount: 2.25 -> "2¼". */
export function formatNumber(n: number, unit = ''): string {
  if (METRIC.has(unit)) {
    return n >= 10 ? String(Math.round(n)) : String(Math.round(n * 10) / 10);
  }
  let whole = Math.floor(n);
  const rest = n - whole;
  let best = FRACTIONS[0];
  for (const f of FRACTIONS) {
    if (Math.abs(f[0] - rest) < Math.abs(best[0] - rest)) best = f;
  }
  if (best[0] === 1) {
    whole += 1;
    best = FRACTIONS[0];
  }
  if (whole === 0 && best[1] === '') return n > 0 ? '⅛' : '0';
  return (whole ? String(whole) : '') + best[1];
}

/** Formats an amount with its unit: (1.5, "cup") -> "1½ cups". */
export function formatQty(qty: number | undefined, unit = ''): string {
  if (qty === undefined) return unit;
  const num = formatNumber(qty, unit);
  if (!unit) return num;
  const plural = qty > 1 && PLURALS[unit] ? PLURALS[unit] : unit;
  return num + ' ' + plural;
}
