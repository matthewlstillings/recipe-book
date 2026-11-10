'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Ingredient } from '@/lib/types';
import type { StepPart } from '@/lib/steps';
import { formatQty } from '@/lib/format';

type Props = {
  steps: StepPart[][];
  ingredients: Ingredient[];
  scale: number;
};

const SHAPE = 'M25 5 C 41 4, 46 18, 43 30 C 40 43, 21 46, 10 39 C 2 33, 3 15, 13 9 C 19 5, 29 3, 37 8';

export default function Steps({ steps, ingredients, scale }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const byId = new Map(ingredients.map((i) => [i.id, i]));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const btn = document.querySelector<HTMLButtonElement>(`[data-mention="${open}"]`);
        setOpen(null);
        btn?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.('.mention')) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <ol className="step-list">
      {steps.map((parts, si) => (
        <li key={si} className="step">
          <span className="step-num" aria-hidden="true">
            <svg viewBox="0 0 48 48"><path d={SHAPE} fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <span>{si + 1}</span>
          </span>
          <p className="step-text">
            {parts.map((p, pi) => {
              if (p.kind === 'text') return <span key={pi}>{p.text}</span>;
              const ing = byId.get(p.id);
              if (!ing) return <span key={pi}>{p.text}</span>;
              const key = `${si}-${pi}`;
              const whole = p.amount === undefined || p.amount === ing.qty;
              const amount = ing.qty === undefined
                ? formatQty(undefined, ing.unit) || 'As needed'
                : formatQty((whole ? ing.qty : p.amount!) * scale, ing.unit);
              const note = ing.qty === undefined
                ? ing.name
                : whole ? 'All of it' : `of ${formatQty(ing.qty * scale, ing.unit)} total`;
              return (
                <Mention
                  key={pi}
                  id={key}
                  text={p.text}
                  open={open === key}
                  onToggle={() => setOpen(open === key ? null : key)}
                  name={p.text}
                  amount={amount}
                  note={note}
                />
              );
            })}
          </p>
        </li>
      ))}
    </ol>
  );
}

function Mention(props: {
  id: string; text: string; open: boolean; onToggle: () => void; name: string; amount: string; note: string;
}) {
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState(0);

  useLayoutEffect(() => {
    if (!props.open || !btn.current || !pop.current) { setShift(0); return; }
    const b = btn.current.getBoundingClientRect();
    const w = pop.current.offsetWidth;
    const room = document.documentElement.clientWidth - 12;
    const over = b.left + w - room;
    setShift(over > 0 ? -Math.min(over, b.left - 12) : 0);
  }, [props.open]);

  const popId = `pop-${props.id}`;
  return (
    <span className="mention">
      <button
        ref={btn}
        type="button"
        data-mention={props.id}
        aria-expanded={props.open}
        aria-controls={props.open ? popId : undefined}
        onClick={props.onToggle}
      >
        {props.text}
      </button>
      {props.open ? (
        <span
          ref={pop}
          id={popId}
          role="status"
          className="popover"
          style={{ left: shift, ['--caret' as string]: `${14 - shift}px` }}
        >
          <span className="label">{props.name}</span>
          <span className="amt">{props.amount}</span>
          <span className="note">{props.note}</span>
        </span>
      ) : null}
    </span>
  );
}
