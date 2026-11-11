import Link from 'next/link';
import Header from '@/components/Header';
import RecipeRow from '@/components/RecipeRow';
import { byNewest, byRating, getCategories, getRecipes } from '@/lib/data';

export default function Home() {
  const recipes = getRecipes();
  const recent = [...recipes].sort(byNewest).slice(0, 3);
  // Categories with no recipes are left off the home page.
  const categories = getCategories()
    .map((c) => ({ ...c, list: recipes.filter((r) => r.category === c.slug).sort(byRating) }))
    .filter((c) => c.list.length > 0);
  return (
    <div className="shell">
      <div className="wrap">
        <Header />
        <main id="main" className="wrap" style={{ gap: 32 }}>
          {recipes.length === 0 ? (
            <div className="empty-card paper">
              <span className="big">No recipes yet.</span>
              <p>Send Claude a recipe link in chat and it&apos;ll show up here.</p>
            </div>
          ) : null}
          {recent.length ? (
            <section className="section" aria-labelledby="recent">
              <h2 id="recent" className="section-head label" style={{ margin: 0 }}>
                <span>Recently added:</span>
              </h2>
              <div className="recent-grid">
                {recent.map((r) => <RecipeRow key={r.slug} recipe={r} />)}
              </div>
            </section>
          ) : null}
          {categories.length ? (
            <section className="section" aria-labelledby="categories">
              <h2 id="categories" className="section-head label" style={{ margin: 0 }}>
                <span>Categories:</span>
                <span>{categories.length}</span>
              </h2>
              <div className="cat-grid">
                {categories.map(({ list, ...c }, i) => {
                  const href = `/c/${c.slug}`;
                  return (
                    <article key={c.slug} className="cat-card paper">
                      <div className="cat-meta label">
                        <span>{String(i + 1).padStart(2, '0')}</span>
                        <span>{`${list.length} ${list.length === 1 ? 'recipe' : 'recipes'}`}</span>
                      </div>
                      <h3 className="cat-name"><Link href={href}>{c.name}</Link></h3>
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
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
