import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, documentToHtml } from '../src/js/preview.js';

test('escapeHtml neutralizes markup characters', () => {
  assert.equal(escapeHtml('<b>&"\'</b>'), '&lt;b&gt;&amp;&quot;&#39;&lt;/b&gt;');
});

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

test('renders masthead, section titles, and field values', () => {
  const html = documentToHtml(doc, { title: 'Keyholder', subtitle: 'For Jane' });
  assert.match(html, /<h2 class="doc__title">Keyholder<\/h2>/);
  assert.match(html, /<h3 class="doc-section__title">The basics<\/h3>/);
  assert.match(html, /<dd class="doc-field__value">Jane<\/dd>/);
});

test('blank fields render a marked empty value, not undefined', () => {
  const html = documentToHtml(doc);
  assert.match(html, /<dd class="doc-field__value is-empty" aria-label="not filled in"><\/dd>/);
  assert.doesNotMatch(html, /undefined|null/);
});

test('repeatable entries carry their heading', () => {
  const html = documentToHtml(doc);
  assert.match(html, /<h4 class="doc-entry__title">Account 1<\/h4>/);
});

test('empty sections render the None listed marker', () => {
  const html = documentToHtml(doc);
  assert.match(html, /<p class="doc-section__empty">None listed<\/p>/);
});

test('user input cannot inject markup', () => {
  const evil = {
    sections: [
      {
        id: 'x',
        title: 'X',
        description: '',
        repeatable: false,
        groups: [{ heading: null, rows: [{ label: 'L', value: '<script>alert(1)</script>' }] }],
        empty: null,
      },
    ],
  };
  const html = documentToHtml(evil);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});

test('newlines in a value become <br>', () => {
  const multi = {
    sections: [
      {
        id: 'x',
        title: 'X',
        description: '',
        repeatable: false,
        groups: [{ heading: null, rows: [{ label: 'L', value: 'a\nb' }] }],
        empty: null,
      },
    ],
  };
  assert.match(documentToHtml(multi), /a<br \/>b/);
});
