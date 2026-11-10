import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Blob from '@/components/Blob';
import Header from '@/components/Header';
import RecipeBody from '@/components/RecipeBody';
import { getRecipe, getRecipes } from '@/lib/data';
import { parseStep } from '@/lib/steps';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getRecipes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = getRecipe(slug);
  return { title: r?.name, description: r?.description };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const r = getRecipe(slug);
  if (!r) notFound();
  const facts = [
    ...(r.time ? [{ label: 'Time:', value: r.time }] : []),
    ...(r.oven ? [{ label: 'Oven:', value: r.oven }] : [])
  ];
  return (
    <div className="shell">
      <div className="wrap" style={{ gap: 24 }}>
        <Header search={false} />
        <div className="recipe-layout">
          <main id="main" className="recipe-main paper">
            <h1 className="recipe-title">{r.name}</h1>
            <RecipeBody slug={r.slug} makes={r.makes} facts={facts} ingredients={r.ingredients} steps={r.steps.map(parseStep)}>
              {r.crowdRating ? (
                <div className="rating">
                  <span className="label">Crowd rating:</span>
                  <div className="rating-row">
                    <span className="rating-num">{r.crowdRating}<small> / 5</small></span>
                    <span className="segs" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((i) => <span key={i} className={`seg${i <= r.crowdRating! ? ' on' : ''}`} />)}
                    </span>
                  </div>
                </div>
              ) : null}
              <span className="baked-state">
                <span aria-hidden="true">Baked</span>
                <span className={`switch${r.baked ? ' on' : ''}`} role="img" aria-label={r.baked ? 'Baked' : 'Not baked yet'} />
              </span>
            </RecipeBody>
            {r.tips.length ? (
              <section className="tips" aria-labelledby="tips-head">
                <h2 id="tips-head" className="label col-head">Tips:</h2>
                {r.tips.map((t, i) => <p key={i}>{t}</p>)}
              </section>
            ) : null}
          </main>

          <aside className="report" aria-labelledby="report-head">
            <h2 id="report-head" className="section-head label" style={{ margin: 0 }}>
              <span>Report card:</span>
              <span>{r.attempts.length} {r.attempts.length === 1 ? 'attempt' : 'attempts'}</span>
            </h2>
            {r.attempts.length ? (
              r.attempts.map((a) => (
                <div key={a.n} className="attempt">
                  <Blob grade={a.grade} />
                  <div className="attempt-body">
                    <span className="attempt-label">Attempt {a.n}</span>
                    {a.notes ? <p className="attempt-notes">{a.notes}</p> : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-attempts">
                <Blob />
                <div className="attempt-body">
                  <span className="big">No attempts yet.</span>
                  <p>Bake it, then send Claude a grade and notes.</p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
