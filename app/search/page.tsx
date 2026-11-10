import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/Header';
import SearchResults, { type SearchItem } from '@/components/SearchResults';
import { getCategories, getRecipes } from '@/lib/data';
import { formatQty } from '@/lib/format';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage() {
  const cats = new Map(getCategories().map((c) => [c.slug, c.name]));
  const items: SearchItem[] = getRecipes().map((r) => ({
    slug: r.slug,
    name: r.name,
    category: cats.get(r.category) ?? '',
    baked: r.baked,
    ingredients: r.ingredients.map((i) => ({
      qty: i.qty === undefined ? '' : formatQty(i.qty, i.unit),
      name: i.name
    }))
  }));
  return (
    <div className="shell">
      <div className="wrap" style={{ gap: 28 }}>
        <Suspense fallback={<Header />}>
          <SearchResults items={items} />
        </Suspense>
      </div>
    </div>
  );
}
