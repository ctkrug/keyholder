import { test } from 'node:test';
import assert from 'node:assert/strict';
import { documentToText } from '../src/js/text.js';

const doc = {
  sections: [
    {
      id: 'basics',
      title: 'The basics',
      description: 'Who this is for.',
      repeatable: false,
      groups: [{ heading: null, rows: [{ label: 'Full legal name', value: 'Jane' }] }],
      empty: null,
    },
    {
      id: 'accounts',
      title: 'Accounts',
      description: 'Logins.',
      repeatable: true,
      groups: [
        { heading: 'Account 1', rows: [{ label: 'Service', value: 'Gmail' }] },
        { heading: 'Account 2', rows: [{ label: 'Service', value: 'Bank' }] },
      ],
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

test('renders masthead when meta supplied', () => {
  const text = documentToText(doc, { title: 'Keyholder', subtitle: 'For Jane Doe' });
  assert.match(text, /^Keyholder\nFor Jane Doe\n=+\n/);
});

test('uppercases section titles and includes descriptions', () => {
  const text = documentToText(doc);
  assert.match(text, /THE BASICS\nWho this is for\./);
});

test('indents fixed rows and repeatable entries with headings', () => {
  const text = documentToText(doc);
  assert.match(text, /THE BASICS\nWho this is for\.\n {2}Full legal name: Jane/);
  assert.match(text, / {2}Account 1\n {4}Service: Gmail/);
  assert.match(text, / {2}Account 2\n {4}Service: Bank/);
});

test('renders the None listed marker for empty sections', () => {
  const text = documentToText(doc);
  assert.match(text, /SUBSCRIPTIONS\n {2}None listed/);
});

test('never prints the word undefined or null for blank values', () => {
  const blank = {
    sections: [
      {
        id: 'a',
        title: 'A',
        description: '',
        repeatable: false,
        groups: [{ heading: null, rows: [{ label: 'X', value: '' }] }],
        empty: null,
      },
    ],
  };
  const text = documentToText(blank);
  assert.equal(text, 'A\n  X: ');
  assert.doesNotMatch(text, /undefined|null/);
});
