import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import RecipeRow from '@/components/RecipeRow';
import { byRating, getCategories, getCategory, getRecipes } from '@/lib/data';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: getCategory(slug)?.name };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const list = getRecipes().filter((r) => r.category === slug).sort(byRating);
  const notBaked = list.filter((r) => !r.baked);
  const baked = list.filter((r) => r.baked);
  return (
    <div className="shell">
      <div className="wrap">
        <Header />
        <main id="main" className="wrap" style={{ gap: 32 }}>
          <div className="title-block">
            <h1 className="page-title">{category.name}</h1>
            <span className="page-sub">
              {list.length ? `${list.length} ${list.length === 1 ? 'recipe' : 'recipes'}` : 'No recipes yet'}
            </span>
          </div>
          {list.length === 0 ? (
            <div className="empty-card paper">
              <span className="big">Nothing here yet.</span>
              <p>Send Claude a recipe link in chat and it&apos;ll show up here.</p>
            </div>
          ) : null}
          {notBaked.length ? (
            <section className="section" aria-labelledby="not-baked">
              <h2 id="not-baked" className="section-head label" style={{ margin: 0 }}>Not baked:</h2>
              <div className="rows">{notBaked.map((r) => <RecipeRow key={r.slug} recipe={r} />)}</div>
            </section>
          ) : null}
          {baked.length ? (
            <section className="section" aria-labelledby="baked">
              <h2 id="baked" className="section-head label" style={{ margin: 0 }}>Baked:</h2>
              <div className="rows">{baked.map((r) => <RecipeRow key={r.slug} recipe={r} />)}</div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
