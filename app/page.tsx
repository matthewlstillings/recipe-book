import Link from 'next/link';
import Header from '@/components/Header';
import { byRating, getCategories, getRecipes } from '@/lib/data';

export default function Home() {
  const categories = getCategories();
  const recipes = getRecipes();
  return (
    <div className="shell">
      <div className="wrap">
        <Header />
        <main id="main" className="section" aria-label="Categories">
          <div className="section-head label">
            <span>Categories:</span>
            <span>{categories.length}</span>
          </div>
          <div className="cat-grid">
            {categories.map((c, i) => {
              const list = recipes.filter((r) => r.category === c.slug).sort(byRating);
              const href = `/c/${c.slug}`;
              return (
                <article key={c.slug} className="cat-card paper">
                  <div className="cat-meta label">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <span>{list.length ? `${list.length} ${list.length === 1 ? 'recipe' : 'recipes'}` : 'Empty'}</span>
                  </div>
                  <h2 className="cat-name"><Link href={href}>{c.name}</Link></h2>
                  {list.length ? (
                    <div className="top-list">
                      <span className="label">Top rated:</span>
                      {list.slice(0, 3).map((r) => (
                        <Link key={r.slug} href={`/r/${r.slug}`} className="top-row">
                          <span>{r.name}</span>
                          <span>{r.crowdRating ? `${r.crowdRating} / 5` : 'Not rated'}</span>
                        </Link>
                      ))}
                      <Link href={href} className="view-all">
                        View all {list.length}<span aria-hidden="true">&nbsp;→</span>
                        <span className="visually-hidden"> {c.name}</span>
                      </Link>
                    </div>
                  ) : (
                    <p className="cat-empty">No recipes yet. Send Claude a link in chat to add one.</p>
                  )}
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
