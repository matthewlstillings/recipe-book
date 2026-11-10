'use client';

import { useRef, useState } from 'react';

export default function SearchBox({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  const input = useRef<HTMLInputElement>(null);
  return (
    <form className="search" role="search" action="/search" method="get">
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#e4e1da" strokeWidth="1.8" />
        <path d="M15.5 15.5L21 21" stroke="#e4e1da" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        ref={input}
        type="search"
        name="q"
        aria-label="Search recipes"
        placeholder="Search recipes or ingredients"
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
  );
}
