import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStep, plainStep } from './steps.ts';

test('parses mentions', () => {
  const parts = parseStep('Fold in most of the [chocolate chips](@chips:1.25), then chill.');
  assert.deepEqual(parts, [
    { kind: 'text', text: 'Fold in most of the ' },
    { kind: 'ingredient', text: 'chocolate chips', id: 'chips', amount: 1.25 },
    { kind: 'text', text: ', then chill.' }
  ]);
});

test('plain text', () => {
  assert.equal(plainStep('Brown the [butter](@butter).'), 'Brown the butter.');
  assert.deepEqual(parseStep('No mentions'), [{ kind: 'text', text: 'No mentions' }]);
});
