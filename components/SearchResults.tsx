'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Header from './Header';
import Tag from './Tag';

export type SearchItem = {
  slug: string;
  name: string;
  category: string;
  baked: boolean;
  ingredients: { qty: string; name: string }[];
};

type Filter = 'All' | 'Not baked' | 'Baked';
const FILTERS: Filter[] = ['All', 'Not baked', 'Baked'];

type Match = {
  item: SearchItem;
  inName: [string, string, string] | null;
  inIng: { qty: string; parts: [string, string, string] } | null;
};

function split(text: string, q: string): [string, string, string] | null {
  const at = text.toLowerCase().indexOf(q);
  if (at < 0) return null;
  return [text.slice(0, at), text.slice(at, at + q.length), text.slice(at + q.length)];
}

export default function SearchResults({ items }: { items: SearchItem[] }) {
  const raw = (useSearchParams().get('q') ?? '').trim();
  const q = raw.toLowerCase();
  const [filter, setFilter] = useState<Filter>('All');

  const matches: Match[] = q
    ? items.flatMap((item): Match[] => {
        const inName = split(item.name, q);
        if (inName) return [{ item, inName, inIng: null }];
        const ing = item.ingredients.find((i) => i.name.toLowerCase().includes(q));
        if (!ing) return [];
        return [{ item, inName: null, inIng: { qty: ing.qty, parts: split(ing.name, q)! } }];
      })
    : [];
  const shown = matches.filter((m) => filter === 'All' || (filter === 'Baked') === m.item.baked);

  return (
    <>
      <Header query={raw} />
      <main id="main" className="wrap" style={{ gap: 28 }}>
        <div className="search-top">
          <div className="title-block">
            {q ? (
              <>
                <span className="label" style={{ fontSize: 12, color: 'var(--page-muted)' }}>Results for:</span>
                <h1 className="page-title search-title">“{raw}”</h1>
                <span className="page-sub" role="status">
                  {matches.length} {matches.length === 1 ? 'match' : 'matches'} in names and ingredients
                </span>
              </>
            ) : (
              <h1 className="page-title search-title">Search</h1>
            )}
          </div>
          {matches.length ? (
            <div className="filters" role="group" aria-label="Show">
              {FILTERS.map((f) => (
                <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          ) : null}
        </div>

        {!q ? (
          <div className="empty-card paper">
            <span className="big">Look something up.</span>
            <p>Search by recipe name or by an ingredient, like butter or chocolate.</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="empty-card paper">
            <span className="big">No recipes use that yet.</span>
            <p>Check the spelling, or try a broader word like butter or chocolate.</p>
          </div>
        ) : shown.length === 0 ? (
          <div className="empty-card paper">
            <span className="big">None of these are {filter.toLowerCase()} yet.</span>
            <p>Switch to All to see every match.</p>
          </div>
        ) : (
          <div className="results paper">
            {shown.map(({ item, inName, inIng }) => (
              <Link key={item.slug} href={`/r/${item.slug}`} className="result">
                <Tag baked={item.baked} />
                <span className="row-name">
                  {inName ? <>{inName[0]}<mark>{inName[1]}</mark>{inName[2]}</> : item.name}
                </span>
                <span className="label cat">{item.category}</span>
                {inIng ? (
                  <span className="why">
                    Ingredient: {inIng.qty ? `${inIng.qty} ` : ''}{inIng.parts[0]}<mark>{inIng.parts[1]}</mark>{inIng.parts[2]}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
