import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatNumber, formatQty } from './format.ts';

test('fractions', () => {
  assert.equal(formatNumber(2.25), '2¼');
  assert.equal(formatNumber(0.5), '½');
  assert.equal(formatNumber(1 / 3 * 2), '⅔');
  assert.equal(formatNumber(0.99), '1');
  assert.equal(formatNumber(3), '3');
});

test('units', () => {
  assert.equal(formatQty(1.5, 'cup'), '1½ cups');
  assert.equal(formatQty(1, 'cup'), '1 cup');
  assert.equal(formatQty(2, 'tsp'), '2 tsp');
  assert.equal(formatQty(4), '4');
  assert.equal(formatQty(250 * 3, 'g'), '750 g');
  assert.equal(formatQty(undefined, 'to taste'), 'to taste');
});
