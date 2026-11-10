'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Ingredient } from '@/lib/types';
import type { StepPart } from '@/lib/steps';
import IngredientList from './IngredientList';
import Steps from './Steps';

type Props = {
  slug: string;
  makes?: { qty: number; unit: string };
  facts: { label: string; value: string }[];
  ingredients: Ingredient[];
  steps: StepPart[][];
  children: React.ReactNode;
};

/** The parts of the recipe that change with the batch size. */
export default function RecipeBody({ slug, makes, facts, ingredients, steps, children }: Props) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get('batch'));
    if (n >= 1 && n <= 6) setScale(n);
  }, []);

  const pick = (n: number) => {
    setScale(n);
    const url = new URL(window.location.href);
    if (n === 1) url.searchParams.delete('batch'); else url.searchParams.set('batch', String(n));
    window.history.replaceState(null, '', url);
  };

  const allFacts = makes ? [{ label: 'Makes:', value: `${makes.qty * scale} ${makes.unit}` }, ...facts] : facts;

  return (
    <>
      <div className="facts">
        {children}
        {allFacts.length ? (
          <div className="facts-group">
            {allFacts.map((f) => (
              <div key={f.label} className="fact">
                <span className="label">{f.label}</span>
                <span className="fact-value" aria-live={f.label === 'Makes:' ? 'polite' : undefined}>{f.value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="controls">
        <label className="batch">
          <span className="label">Batch size:</span>
          <span className="select-wrap">
            <select value={scale} onChange={(e) => pick(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}× batch</option>)}
            </select>
            <svg aria-hidden="true" width="12" height="8" viewBox="0 0 12 8"><path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="#2b2a28" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </label>
        <Link className="btn" href={`/r/${slug}/cook/${scale}`}>Cook mode</Link>
      </div>

      <div className="cols">
        <section className="ingredients" aria-labelledby="ing-head">
          <h2 id="ing-head" className="label col-head">Ingredients:</h2>
          <IngredientList ingredients={ingredients} scale={scale} />
        </section>
        <section className="steps" aria-labelledby="steps-head">
          <h2 id="steps-head" className="label col-head">Steps:</h2>
          <Steps steps={steps} ingredients={ingredients} scale={scale} />
        </section>
      </div>
    </>
  );
}
