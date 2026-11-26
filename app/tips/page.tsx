import type { Metadata } from 'next';
import Header from '@/components/Header';
import TipsList from '@/components/TipsList';
import { getTips } from '@/lib/data';

export const metadata: Metadata = { title: 'Tips' };

export default function TipsPage() {
  const sections = getTips();
  return (
    <div className="shell">
      <div className="wrap">
        <Header search={false} current="tips" />
        <main id="main" className="wrap tips-page" style={{ gap: 24 }}>
          <div className="title-block">
            <h1 className="page-title">Tips</h1>
            <span className="page-sub">Baking terms and techniques, in plain words.</span>
          </div>
          <TipsList sections={sections} />
        </main>
      </div>
    </div>
  );
}
