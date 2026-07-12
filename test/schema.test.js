import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SECTIONS } from '../src/js/schema.js';

test('every section has an id, title, and at least one field', () => {
  assert.ok(SECTIONS.length > 0);
  for (const section of SECTIONS) {
    assert.ok(section.id);
    assert.ok(section.title);
    assert.ok(section.fields.length > 0);
  }
});

test('every field has an id, label, and type', () => {
  for (const section of SECTIONS) {
    for (const field of section.fields) {
      assert.ok(field.id);
      assert.ok(field.label);
      assert.ok(field.type);
    }
  }
});
