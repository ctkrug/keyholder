import { test } from 'node:test';
import assert from 'node:assert/strict';
import { documentToPdfLines } from '../src/js/pdf-layout.js';

const doc = {
  sections: [
    {
      id: 'basics',
      title: 'The basics',
      description: 'Who this is for.',
      repeatable: false,
      groups: [
        {
          heading: null,
          rows: [
            { label: 'Full legal name', value: 'Jane' },
            { label: 'Note', value: '' },
          ],
        },
      ],
      empty: null,
    },
    {
      id: 'accounts',
      title: 'Accounts',
      description: '',
      repeatable: true,
      groups: [{ heading: 'Account 1', rows: [{ label: 'Service', value: 'Gmail' }] }],
      empty: null,
    },
    {
      id: 'subs',
      title: 'Subscriptions',
      description: '',
      repeatable: true,
      groups: [],
      empty: 'None listed',
    },
  ],
};

test('emits masthead instructions from meta', () => {
  const lines = documentToPdfLines(doc, { title: 'Keyholder', subtitle: 'For Jane' });
  assert.deepEqual(lines[0], { style: 'title', text: 'Keyholder' });
  assert.deepEqual(lines[1], { style: 'subtitle', text: 'For Jane' });
});

test('field with a value reads "Label: value", blank reads "Label:"', () => {
  const lines = documentToPdfLines(doc);
  assert.ok(lines.some((l) => l.style === 'field' && l.text === 'Full legal name: Jane'));
  assert.ok(lines.some((l) => l.style === 'field' && l.text === 'Note:'));
});

test('preserves section -> entry -> field ordering', () => {
  const styles = documentToPdfLines(doc).map((l) => `${l.style}:${l.text}`);
  const iSection = styles.indexOf('section:Accounts');
  const iEntry = styles.indexOf('entry:Account 1');
  const iField = styles.indexOf('field:Service: Gmail');
  assert.ok(iSection < iEntry && iEntry < iField);
});

test('empty sections emit a single empty instruction and no fields', () => {
  const lines = documentToPdfLines(doc);
  const subsIdx = lines.findIndex((l) => l.style === 'section' && l.text === 'Subscriptions');
  assert.deepEqual(lines[subsIdx + 1], { style: 'empty', text: 'None listed' });
});

test('unicode, RTL, and emoji values pass through untouched', () => {
  const value = 'مرحبا بالعالم 🔑 日本語 Müller-Østergård';
  const intl = {
    sections: [
      {
        id: 'x',
        title: 'X',
        description: '',
        repeatable: false,
        groups: [{ heading: null, rows: [{ label: 'Name', value }] }],
        empty: null,
      },
    ],
  };
  const lines = documentToPdfLines(intl);
  assert.ok(lines.some((l) => l.style === 'field' && l.text === `Name: ${value}`));
});

test('never leaks undefined/null into instruction text', () => {
  const lines = documentToPdfLines(doc);
  for (const line of lines) assert.doesNotMatch(line.text, /undefined|null/);
});
