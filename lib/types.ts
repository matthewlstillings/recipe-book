export type Grade =
  | 'A+' | 'A' | 'A-'
  | 'B+' | 'B' | 'B-'
  | 'C+' | 'C' | 'C-'
  | 'D+' | 'D' | 'D-'
  | 'F';

export type Category = {
  slug: string;
  name: string;
};

export type Ingredient = {
  /** Short id used to reference this ingredient from steps, like "butter". */
  id: string;
  /** Amount for a 1x batch. Leave out for things like "salt, to taste". */
  qty?: number;
  /** Unit like "cup", "tsp", "g". Leave empty for a count, like 2 eggs. */
  unit?: string;
  /** What shows in the list, like "butter, browned and cooled". */
  name: string;
};

export type Attempt = {
  /** 1 for the first time it was baked, then 2, 3 and so on. */
  n: number;
  grade: Grade;
  notes: string;
};

export type Recipe = {
  slug: string;
  name: string;
  category: string;
  /** One short line for list rows. */
  description: string;
  /** How much Matthew thinks others liked it, 1 to 5. Leave out if not rated yet. */
  crowdRating?: number;
  baked: boolean;
  makes?: { qty: number; unit: string };
  time?: string;
  oven?: string;
  ingredients: Ingredient[];
  /**
   * Steps in plain text. Mark an ingredient with [words](@id), or
   * [words](@id:1.25) when the step uses only part of it (1x batch amount).
   */
  steps: string[];
  tips: string[];
  attempts: Attempt[];
  /** Where the recipe came from. Kept for reference, not shown. */
  source?: string;
};
