import type { Ingredient } from '@/lib/types';
import { formatGrams, formatQty } from '@/lib/format';

export default function IngredientList({ ingredients, scale }: { ingredients: Ingredient[]; scale: number }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {ingredients.map((i) => {
        const grams = i.qty === undefined ? '' : formatGrams(i.qty * scale, i.qty, i.grams);
        return (
          <li key={i.id} className="ing">
            <span className="ing-qty">
              {i.qty === undefined ? '' : formatQty(i.qty * scale, i.unit)}
              {grams ? <span className="ing-g">{grams}</span> : null}
            </span>
            <span style={{ minWidth: 0 }}>{i.name}</span>
          </li>
        );
      })}
    </ul>
  );
}
