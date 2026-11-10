export type StepPart =
  | { kind: 'text'; text: string }
  | { kind: 'ingredient'; text: string; id: string; amount?: number };

const MENTION = /\[([^\]]+)\]\(@([a-z0-9-]+)(?::([0-9]*\.?[0-9]+))?\)/g;

/** Splits "Brown the [butter](@butter) slowly" into text and ingredient parts. */
export function parseStep(step: string): StepPart[] {
  const parts: StepPart[] = [];
  let last = 0;
  for (const m of step.matchAll(MENTION)) {
    const at = m.index ?? 0;
    if (at > last) parts.push({ kind: 'text', text: step.slice(last, at) });
    parts.push({
      kind: 'ingredient',
      text: m[1],
      id: m[2],
      amount: m[3] === undefined ? undefined : Number(m[3])
    });
    last = at + m[0].length;
  }
  if (last < step.length) parts.push({ kind: 'text', text: step.slice(last) });
  return parts;
}

/** The step with mentions turned back into plain words, for search and accessibility. */
export function plainStep(step: string): string {
  return parseStep(step).map((p) => p.text).join('');
}
