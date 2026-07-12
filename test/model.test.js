import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyEntry,
  createInitialState,
  entryIsEmpty,
  buildDocument,
  buildMeta,
  applyDraft,
} from '../src/js/model.js';

const fixed = {
  id: 'basics',
  title: 'The basics',
  description: 'Who this is for.',
  fields: [
    { id: 'fullName', label: 'Full legal name', type: 'text' },
    { id: 'note', label: 'Note', type: 'textarea' },
  ],
};

const repeatable = {
  id: 'accounts',
  title: 'Accounts',
  description: 'Logins.',
  repeatable: { noun: 'account', addLabel: 'Add an account' },
  fields: [
    { id: 'service', label: 'Service', type: 'text' },
    { id: 'user', label: 'User', type: 'text' },
  ],
};

test('emptyEntry has every field present and blank', () => {
  assert.deepEqual(emptyEntry(fixed), { fullName: '', note: '' });
});

test('createInitialState gives fixed an object and repeatable one blank entry', () => {
  const state = createInitialState([fixed, repeatable]);
  assert.deepEqual(state.basics, { fullName: '', note: '' });
  assert.deepEqual(state.accounts, [{ service: '', user: '' }]);
});

test('entryIsEmpty treats whitespace-only values as empty', () => {
  assert.equal(entryIsEmpty({ service: '   ', user: '\n' }, repeatable.fields), true);
  assert.equal(entryIsEmpty({ service: 'Gmail', user: '' }, repeatable.fields), false);
  assert.equal(entryIsEmpty(undefined, repeatable.fields), true);
});

test('buildDocument renders a fixed section as one group with all rows', () => {
  const doc = buildDocument([fixed], { basics: { fullName: 'Jane', note: '' } });
  assert.equal(doc.sections.length, 1);
  const s = doc.sections[0];
  assert.equal(s.repeatable, false);
  assert.equal(s.empty, null);
  assert.deepEqual(s.groups, [
    {
      heading: null,
      rows: [
        { label: 'Full legal name', value: 'Jane' },
        { label: 'Note', value: '' },
      ],
    },
  ]);
});

test('buildDocument never emits undefined/null for a missing value', () => {
  const doc = buildDocument([fixed], {});
  const rows = doc.sections[0].groups[0].rows;
  assert.equal(rows[0].value, '');
  assert.equal(rows[1].value, '');
});

test('buildDocument numbers repeatable entries and drops blank ones', () => {
  const state = {
    accounts: [
      { service: 'Gmail', user: 'jane@example.com' },
      { service: '   ', user: '' }, // blank -> dropped
      { service: 'Bank', user: 'jane' },
    ],
  };
  const s = buildDocument([repeatable], state).sections[0];
  assert.equal(s.repeatable, true);
  assert.equal(s.empty, null);
  assert.equal(s.groups.length, 2);
  assert.equal(s.groups[0].heading, 'Account 1');
  assert.equal(s.groups[1].heading, 'Account 2'); // renumbered after the drop
  assert.equal(s.groups[1].rows[0].value, 'Bank');
});

test('buildDocument marks an all-blank repeatable section None listed', () => {
  const s = buildDocument([repeatable], { accounts: [{ service: '', user: '' }] }).sections[0];
  assert.deepEqual(s.groups, []);
  assert.equal(s.empty, 'None listed');
});

test('buildMeta falls back to a generic title and subtitle when basics is empty', () => {
  assert.deepEqual(buildMeta(), {
    title: 'Keyholder Checklist',
    subtitle: 'A guide for the people you trust, if something happens to me.',
  });
  assert.deepEqual(buildMeta({ fullName: '  ', datePrepared: '' }), {
    title: 'Keyholder Checklist',
    subtitle: 'A guide for the people you trust, if something happens to me.',
  });
});

test('buildMeta personalizes title and subtitle once basics are filled in', () => {
  assert.deepEqual(buildMeta({ fullName: 'Jane Doe', datePrepared: 'July 2026' }), {
    title: 'Jane Doe’s Keyholder Checklist',
    subtitle: 'Prepared July 2026',
  });
});

test('applyDraft merges matching fixed and repeatable sections into state', () => {
  const state = createInitialState([fixed, repeatable]);
  const draft = {
    basics: { fullName: 'Jane Doe', note: 'hi' },
    accounts: [{ service: 'Gmail', user: 'jane@example.com' }, { service: 'Bank', user: 'jane' }],
  };

  applyDraft([fixed, repeatable], state, draft);

  assert.deepEqual(state.basics, { fullName: 'Jane Doe', note: 'hi' });
  assert.deepEqual(state.accounts, [
    { service: 'Gmail', user: 'jane@example.com' },
    { service: 'Bank', user: 'jane' },
  ]);
});

test('applyDraft drops unknown keys and coerces non-string field values', () => {
  const state = createInitialState([fixed]);
  applyDraft([fixed], state, { basics: { fullName: 'Jane', note: 42, evil: '<script>' } });
  assert.deepEqual(state.basics, { fullName: 'Jane', note: '' });
});

test('applyDraft leaves a section untouched when the draft is missing or mismatched', () => {
  const state = createInitialState([fixed, repeatable]);
  const before = structuredClone(state);

  applyDraft([fixed, repeatable], state, { basics: 'not an object', accounts: {} });

  assert.deepEqual(state, before);
});

test('applyDraft is a no-op for null, non-object, or empty-array-shaped drafts', () => {
  const state = createInitialState([fixed, repeatable]);
  const before = structuredClone(state);

  assert.deepEqual(applyDraft([fixed, repeatable], structuredClone(state), null), before);
  assert.deepEqual(applyDraft([fixed, repeatable], structuredClone(state), 'nope'), before);
  applyDraft([fixed, repeatable], state, { accounts: [] });
  assert.deepEqual(state, before);
});

test('applyDraft is a no-op when the whole draft is an array, not the expected section map', () => {
  const state = createInitialState([fixed, repeatable]);
  const before = structuredClone(state);

  applyDraft([fixed, repeatable], state, [1, 2, 3]);

  assert.deepEqual(state, before);
});

test('applyDraft sanitizes malformed repeatable entries instead of crashing', () => {
  const state = createInitialState([repeatable]);
  const draft = {
    accounts: [null, 'not an object', 42, { service: 'Gmail', user: 'jane', evil: true }],
  };

  applyDraft([repeatable], state, draft);

  assert.deepEqual(state.accounts, [
    { service: '', user: '' },
    { service: '', user: '' },
    { service: '', user: '' },
    { service: 'Gmail', user: 'jane' },
  ]);
});

test('buildDocument handles many repeatable entries and renumbers past ten', () => {
  const entries = Array.from({ length: 12 }, (_, i) => ({ service: `Service ${i}`, user: `user${i}` }));
  const s = buildDocument([repeatable], { accounts: entries }).sections[0];
  assert.equal(s.groups.length, 12);
  assert.equal(s.groups[0].heading, 'Account 1');
  assert.equal(s.groups[11].heading, 'Account 12');
  assert.equal(s.groups[11].rows[0].value, 'Service 11');
});

test('buildDocument preserves unicode, RTL, and emoji values untouched', () => {
  const value = 'مرحبا بالعالم 🔑 日本語 Müller-Østergård';
  const doc = buildDocument([fixed], { basics: { fullName: value, note: '' } });
  assert.equal(doc.sections[0].groups[0].rows[0].value, value);
});

test('buildDocument preserves schema order', () => {
  const doc = buildDocument([fixed, repeatable], createInitialState([fixed, repeatable]));
  assert.deepEqual(
    doc.sections.map((s) => s.id),
    ['basics', 'accounts'],
  );
});
