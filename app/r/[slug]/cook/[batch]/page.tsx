import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import IngredientList from '@/components/IngredientList';
import Steps from '@/components/Steps';
import { getRecipe, getRecipes } from '@/lib/data';
import { parseStep } from '@/lib/steps';

type Props = { params: Promise<{ slug: string; batch: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getRecipes().flatMap((r) => [1, 2, 3, 4, 5, 6].map((n) => ({ slug: r.slug, batch: String(n) })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Cook mode: ${getRecipe(slug)?.name ?? ''}` };
}

export default async function CookPage({ params }: Props) {
  const { slug, batch } = await params;
  const r = getRecipe(slug);
  const scale = Number(batch);
  if (!r || !(scale >= 1 && scale <= 6)) notFound();
  const makes = r.makes ? `, makes ${r.makes.qty * scale}` : '';
  return (
    <div className="shell cook" style={{ paddingTop: 16 }}>
      <div className="wrap">
        <div className="cook-head">
          <div>
            <span className="label">Cook mode · {scale}× batch{makes}</span>
            <h1 className="cook-name">{r.name}</h1>
          </div>
          <Link className="close" href={`/r/${r.slug}${scale > 1 ? `?batch=${scale}` : ''}`} aria-label="Close cook mode">×</Link>
        </div>
        <main id="main" className="cook-card paper">
          <section className="ingredients" aria-labelledby="ing-head">
            <h2 id="ing-head" className="label col-head">Ingredients:</h2>
            <IngredientList ingredients={r.ingredients} scale={scale} />
          </section>
          <section className="steps" aria-labelledby="steps-head">
            <h2 id="steps-head" className="label col-head">Steps:</h2>
            <Steps steps={r.steps.map(parseStep)} ingredients={r.ingredients} scale={scale} />
          </section>
        </main>
      </div>
    </div>
  );
}
