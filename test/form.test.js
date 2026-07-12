import { test } from 'node:test';
import assert from 'node:assert/strict';
import { controlId } from '../src/js/form.js';

test('fixed-field control ids omit the index', () => {
  assert.equal(controlId('basics', 'fullName'), 'f-basics-fullName');
  assert.equal(controlId('basics', 'fullName', null), 'f-basics-fullName');
});

test('repeatable control ids include the entry index', () => {
  assert.equal(controlId('accounts', 'service', 0), 'f-accounts-0-service');
  assert.equal(controlId('accounts', 'service', 2), 'f-accounts-2-service');
});

test('ids are unique across sections that share a field id', () => {
  const a = controlId('accounts', 'notes', 0);
  const b = controlId('financial', 'notes', 0);
  assert.notEqual(a, b);
});
