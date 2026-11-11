import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { Category, Grade, Recipe } from './types';
import { parseStep } from './steps';

const GRADES: Grade[] = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Sample recipes for local design checks only: RECIPE_FIXTURES=1 npm run dev
const ROOT = path.join(process.cwd(), 'content', process.env.RECIPE_FIXTURES === '1' ? 'fixtures' : '');

function fail(file: string, msg: string): never {
  throw new Error(`content/${file}: ${msg}`);
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
}

function check(file: string, r: Recipe, categories: Set<string>) {
  const need = (ok: unknown, msg: string) => { if (!ok) fail(file, msg); };
  need(typeof r.slug === 'string' && SLUG.test(r.slug), 'slug must be lowercase words joined by hyphens');
  need(file === `recipes/${r.slug}.json`, `file name must match slug "${r.slug}"`);
  need(typeof r.name === 'string' && r.name.trim(), 'name is required');
  need(categories.has(r.category), `category "${r.category}" is not in categories.json`);
  need(typeof r.description === 'string' && r.description.trim(), 'description is required');
  need(r.description.length <= 120, 'description should be one short line (120 characters max)');
  need(r.crowdRating === undefined || (Number.isInteger(r.crowdRating) && r.crowdRating >= 1 && r.crowdRating <= 5), 'crowdRating must be 1 to 5');
  need(typeof r.baked === 'boolean', 'baked must be true or false');
  need(r.added === undefined || (typeof r.added === 'string' && !Number.isNaN(Date.parse(r.added))), 'added must be a date like 2026-11-10T17:46:00Z');
  need(Array.isArray(r.ingredients) && r.ingredients.length > 0, 'ingredients are required');
  need(Array.isArray(r.steps) && r.steps.length > 0, 'steps are required');
  need(Array.isArray(r.tips), 'tips must be a list (can be empty)');
  need(Array.isArray(r.attempts), 'attempts must be a list (can be empty)');
  const ids = new Map<string, number | undefined>();
  for (const ing of r.ingredients) {
    need(typeof ing.id === 'string' && SLUG.test(ing.id), `ingredient id "${ing.id}" must be lowercase words joined by hyphens`);
    need(!ids.has(ing.id), `ingredient id "${ing.id}" is used twice`);
    need(ing.qty === undefined || (typeof ing.qty === 'number' && ing.qty > 0), `ingredient "${ing.id}" qty must be a positive number`);
    need(typeof ing.name === 'string' && ing.name.trim(), `ingredient "${ing.id}" needs a name`);
    ids.set(ing.id, ing.qty);
  }
  r.steps.forEach((step, i) => {
    for (const p of parseStep(step)) {
      if (p.kind !== 'ingredient') continue;
      need(ids.has(p.id), `step ${i + 1} mentions unknown ingredient "${p.id}"`);
      const total = ids.get(p.id);
      if (p.amount !== undefined) {
        need(total !== undefined && p.amount <= total, `step ${i + 1} uses more "${p.id}" than the recipe has`);
      }
    }
  });
  const seen = new Set<number>();
  for (const a of r.attempts) {
    need(Number.isInteger(a.n) && a.n > 0 && !seen.has(a.n), 'attempt numbers must be unique whole numbers');
    need(GRADES.includes(a.grade), `attempt ${a.n} grade "${a.grade}" is not a letter grade`);
    need(typeof a.notes === 'string', `attempt ${a.n} needs notes (can be empty)`);
    seen.add(a.n);
  }
}

let cache: { categories: Category[]; recipes: Recipe[] } | null = null;

function load() {
  if (cache) return cache;
  const categories = readJson('categories.json') as Category[];
  const catSlugs = new Set<string>();
  for (const c of categories) {
    if (!SLUG.test(c.slug) || catSlugs.has(c.slug)) fail('categories.json', `bad or repeated slug "${c.slug}"`);
    catSlugs.add(c.slug);
  }
  const dir = path.join(ROOT, 'recipes');
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
  const recipes = files.map((f) => {
    const file = `recipes/${f}`;
    const r = readJson(file) as Recipe;
    check(file, r, catSlugs);
    r.attempts = [...r.attempts].sort((a, b) => b.n - a.n);
    return r;
  });
  cache = { categories, recipes };
  return cache;
}

export function getCategories(): Category[] {
  return load().categories;
}

export function getRecipes(): Recipe[] {
  return load().recipes;
}

export function getRecipe(slug: string): Recipe | undefined {
  return load().recipes.find((r) => r.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return load().categories.find((c) => c.slug === slug);
}

/** Best crowd rating first, unrated last, then by name. */
export function byRating(a: Recipe, b: Recipe): number {
  return (b.crowdRating ?? 0) - (a.crowdRating ?? 0) || a.name.localeCompare(b.name);
}

/** Most recently added first; recipes with no added date go last. */
export function byNewest(a: Recipe, b: Recipe): number {
  const t = (r: Recipe) => (r.added ? Date.parse(r.added) : 0);
  return t(b) - t(a) || a.name.localeCompare(b.name);
}
