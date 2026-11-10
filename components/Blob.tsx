import type { Grade } from '@/lib/types';

const FILL: Record<string, string> = {
  A: 'var(--grade-a)', B: 'var(--grade-b)', C: 'var(--grade-c)', D: 'var(--grade-d)', F: 'var(--grade-f)'
};

const SHAPE = 'M24 6 C 38 5, 44 17, 42 29 C 40 41, 22 44, 12 38 C 4 33, 5 16, 13 10 C 17 7, 21 6, 24 6 Z';
const LINE = 'M25 5 C 41 4, 46 18, 43 30 C 40 43, 21 46, 10 39 C 2 33, 3 15, 13 9 C 19 5, 29 3, 37 8';

/** Hand-drawn grade circle. With no grade it shows a dashed "?" for "not graded yet". */
export default function Blob({ grade, stroke = 'var(--page-text)' }: { grade?: Grade; stroke?: string }) {
  if (!grade) {
    return (
      <span className="blob empty" aria-hidden="true">
        <svg viewBox="0 0 48 48"><path d={LINE} fill="none" stroke="var(--rule)" strokeWidth="1.6" strokeDasharray="3 4" strokeLinecap="round" /></svg>
        <span>?</span>
      </span>
    );
  }
  return (
    <span className="blob">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d={SHAPE} fill={FILL[grade.charAt(0)]} />
        <path d={LINE} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span><span className="visually-hidden">Grade </span>{grade}</span>
    </span>
  );
}
