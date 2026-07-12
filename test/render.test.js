import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderDocument } from '../src/js/render.js';

test('renders section title and field labels with values', () => {
  const sections = [
    {
      id: 'basics',
      title: 'Basics',
      fields: [{ id: 'fullName', label: 'Full legal name', type: 'text' }],
    },
  ];

  const output = renderDocument(sections, { fullName: 'Jane Doe' });

  assert.equal(output, 'Basics\nFull legal name: Jane Doe');
});

test('renders an empty string for missing values instead of throwing', () => {
  const sections = [
    {
      id: 'basics',
      title: 'Basics',
      fields: [{ id: 'fullName', label: 'Full legal name', type: 'text' }],
    },
  ];

  const output = renderDocument(sections, {});

  assert.equal(output, 'Basics\nFull legal name: ');
});

test('joins multiple sections with a blank line', () => {
  const sections = [
    { id: 'a', title: 'A', fields: [{ id: 'x', label: 'X', type: 'text' }] },
    { id: 'b', title: 'B', fields: [{ id: 'y', label: 'Y', type: 'text' }] },
  ];

  const output = renderDocument(sections, { x: '1', y: '2' });

  assert.equal(output, 'A\nX: 1\n\nB\nY: 2');
});
