# recipe book.

A public, read-only recipe book. There are no logins and no forms. Recipes and attempts are added by committing files to this repo, and Vercel redeploys on every push to `main`.

- **Design:** see [DESIGN.md](DESIGN.md).
- **Stack:** Next.js (App Router, fully static pages), no database, no environment variables.
- **Hosting:** Vercel, at `queerdough.junk-drawer.dev`. Search engines are told not to index it.

## Adding a recipe

Add one file per recipe at `content/recipes/<slug>.json`. The file name must match `slug`. The build checks every file and fails with a plain message if something is off.

```json
{
  "slug": "brown-butter-chocolate-chip",
  "name": "Brown butter chocolate chip cookies",
  "category": "cookies",
  "description": "Nutty brown butter dough with pools of chocolate. Chewy middles, crisp edges.",
  "crowdRating": 4,
  "baked": false,
  "makes": { "qty": 24, "unit": "cookies" },
  "time": "1 hr 15 min",
  "oven": "350°F",
  "ingredients": [
    { "id": "butter", "qty": 1, "unit": "cup", "name": "butter, browned and cooled" },
    { "id": "eggs", "qty": 2, "name": "large eggs" },
    { "id": "salt", "name": "flaky salt, to finish" }
  ],
  "steps": [
    "Brown the [butter](@butter) until it smells nutty.",
    "Fold in most of the [chocolate chips](@chips:1.25), then chill the dough."
  ],
  "tips": ["Chilling overnight gives a deeper toffee flavor."],
  "attempts": [{ "n": 1, "grade": "B+", "notes": "Thick and chewy." }],
  "source": "https://example.com/the-original-recipe"
}
```

Field rules:

- **description:** one short line, 120 characters max. Write it in your own words when adding the recipe.
- **crowdRating:** Matthew's guess at how much others liked it, 1 to 5. Leave it out until he gives one.
- **ingredients:** amounts are for a 1x batch. The site scales them up to 6x. `unit` is left out for counts (2 eggs), and `qty` is left out for things like "to taste".
- **steps:** mark every ingredient a step uses as `[words](@id)`. When the step uses only part of it, add the 1x amount: `[words](@id:1.25)`.
- **attempts:** `n` counts up from 1. `grade` is one of A+ A A- B+ B B- C+ C C- D+ D D- F. No dates.
- **baked:** set to `true` once there's a first attempt.
- **source:** kept for reference, not shown on the site.

Categories live in `content/categories.json`. Their order is the order on the home page.

## Local development

```bash
npm install
npm run dev:fixtures   # sample recipes from content/fixtures, for checking the design
npm run build          # the real content; fails if any recipe file is invalid
npm test               # amount formatting and step parsing
```
