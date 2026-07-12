import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SECTIONS } from '../src/js/schema.js';

test('every section has an id, title, and at least one field', () => {
  assert.ok(SECTIONS.length > 0);
  for (const section of SECTIONS) {
    assert.ok(section.id, `section missing id`);
    assert.ok(section.title, `section ${section.id} missing title`);
    assert.ok(section.fields.length > 0, `section ${section.id} has no fields`);
  }
});

test('every field has an id, label, and a valid type', () => {
  for (const section of SECTIONS) {
    for (const field of section.fields) {
      assert.ok(field.id, `field in ${section.id} missing id`);
      assert.ok(field.label, `field ${section.id}.${field.id} missing label`);
      assert.ok(
        field.type === 'text' || field.type === 'textarea',
        `field ${section.id}.${field.id} has unexpected type ${field.type}`,
      );
    }
  }
});

test('section ids are unique across the schema', () => {
  const ids = SECTIONS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('field ids are unique within each section', () => {
  for (const section of SECTIONS) {
    const ids = section.fields.map((f) => f.id);
    assert.equal(new Set(ids).size, ids.length, `duplicate field id in ${section.id}`);
  }
});

test('repeatable sections declare a noun and an add label', () => {
  for (const section of SECTIONS) {
    if (!section.repeatable) continue;
    assert.ok(section.repeatable.noun, `${section.id} repeatable missing noun`);
    assert.ok(section.repeatable.addLabel, `${section.id} repeatable missing addLabel`);
  }
});

test('the free-form notes section is pinned last', () => {
  assert.equal(SECTIONS[SECTIONS.length - 1].id, 'notes');
});
