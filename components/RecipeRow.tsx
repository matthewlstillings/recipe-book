import Link from 'next/link';
import type { Recipe } from '@/lib/types';
import Tag from './Tag';

export default function RecipeRow({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/r/${recipe.slug}`} className="row-card paper">
      <Tag baked={recipe.baked} />
      <span className="row-name">{recipe.name}</span>
      <p className="row-desc">{recipe.description}</p>
    </Link>
  );
}
