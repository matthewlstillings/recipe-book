'use client';

import { useEffect, useRef, useState } from 'react';
import type { TipSection } from '@/lib/types';

function mark(text: string, q: string) {
  if (!q) return text;
  const lower = text.toLowerCase();
  const out: React.ReactNode[] = [];
  let from = 0;
  let at = lower.indexOf(q);
  while (at >= 0) {
    out.push(text.slice(from, at), <mark key={at}>{text.slice(at, at + q.length)}</mark>);
    from = at + q.length;
    at = lower.indexOf(q, from);
  }
  out.push(text.slice(from));
  return out;
}

export default function TipsList({ sections }: { sections: TipSection[] }) {
  const [value, setValue] = useState('');
  const [ready, setReady] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const q = value.trim().toLowerCase();

  // Read ?q once on load. Done here, not with useSearchParams, so the full
  // list is in the static HTML.
  useEffect(() => {
    setValue(new URLSearchParams(window.location.search).get('q') ?? '');
    setReady(true);
  }, []);

  // Keep ?q in the address so a filtered list can be shared or reloaded.
  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    if (q) url.searchParams.set('q', value.trim());
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }, [q, value, ready]);

  const shown = sections
    .map((s) => ({
      ...s,
      tips: q
        ? s.tips.filter((t) =>
            [t.term, t.body, ...t.keywords].some((x) => x.toLowerCase().includes(q))
          )
        : s.tips
    }))
    .filter((s) => s.tips.length);
  const count = shown.reduce((n, s) => n + s.tips.length, 0);

  return (
    <>
      <form className="search tips-search" role="search" onSubmit={(e) => e.preventDefault()}>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#e4e1da" strokeWidth="1.8" />
          <path d="M15.5 15.5L21 21" stroke="#e4e1da" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          ref={input}
          type="search"
          aria-label="Search tips"
          placeholder="Search tips, like scald or peaks"
          autoComplete="off"
          enterKeyHint="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value ? (
          <button
            type="button"
            className="clear"
            aria-label="Clear search"
            onClick={() => { setValue(''); input.current?.focus(); }}
          >
            ×
          </button>
        ) : null}
      </form>

      <span className="page-sub" role="status">
        {q ? `${count} ${count === 1 ? 'tip matches' : 'tips match'} “${value.trim()}”` : `${count} tips`}
      </span>

      {count === 0 ? (
        <div className="empty-card paper">
          <span className="big">No tips for that yet.</span>
          <p>Try a shorter word, like milk, egg or butter. Or ask Claude in chat and it can add one.</p>
        </div>
      ) : (
        shown.map((s) => (
          <section key={s.section} className="section tips-section" aria-label={s.section}>
            <h2 className="section-head label" style={{ margin: 0 }}>{s.section}:</h2>
            <div className="results paper">
              {s.tips.map((t) => (
                <article key={t.id} id={t.id} className="tip">
                  <h3 className="tip-term">{mark(t.term, q)}</h3>
                  <p className="tip-body">{mark(t.body, q)}</p>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
