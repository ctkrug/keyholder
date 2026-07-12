import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTOSAVE_KEY,
  DRAFT_KEY,
  isAutosaveEnabled,
  setAutosaveEnabled,
  saveDraft,
  loadDraft,
  clearDraft,
} from '../src/js/storage.js';

// A minimal Web Storage API fake — enough surface for these pure functions,
// no jsdom/localStorage global required.
function fakeStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    _map: map,
  };
}

test('isAutosaveEnabled is false until explicitly turned on', () => {
  const storage = fakeStorage();
  assert.equal(isAutosaveEnabled(storage), false);
  setAutosaveEnabled(storage, true);
  assert.equal(isAutosaveEnabled(storage), true);
});

test('setAutosaveEnabled(false) clears both the preference and the draft', () => {
  const storage = fakeStorage();
  setAutosaveEnabled(storage, true);
  saveDraft(storage, { basics: { fullName: 'Jane' } });

  setAutosaveEnabled(storage, false);

  assert.equal(isAutosaveEnabled(storage), false);
  assert.equal(storage.getItem(DRAFT_KEY), null);
});

test('saveDraft then loadDraft round-trips the state object', () => {
  const storage = fakeStorage();
  const state = { basics: { fullName: 'Jane Doe' }, accounts: [{ service: 'Gmail' }] };
  saveDraft(storage, state);
  assert.deepEqual(loadDraft(storage), state);
});

test('loadDraft returns null when there is nothing saved', () => {
  const storage = fakeStorage();
  assert.equal(loadDraft(storage), null);
});

test('loadDraft returns null for corrupt JSON instead of throwing', () => {
  const storage = fakeStorage();
  storage.setItem(DRAFT_KEY, '{not valid json');
  assert.equal(loadDraft(storage), null);
});

test('loadDraft returns null for a non-object draft (e.g. a stray string or number)', () => {
  const storage = fakeStorage();
  storage.setItem(DRAFT_KEY, JSON.stringify('just a string'));
  assert.equal(loadDraft(storage), null);
  storage.setItem(DRAFT_KEY, JSON.stringify(42));
  assert.equal(loadDraft(storage), null);
  storage.setItem(DRAFT_KEY, JSON.stringify(null));
  assert.equal(loadDraft(storage), null);
});

test('clearDraft removes the draft without touching the autosave preference', () => {
  const storage = fakeStorage();
  setAutosaveEnabled(storage, true);
  saveDraft(storage, { basics: {} });

  clearDraft(storage);

  assert.equal(storage.getItem(DRAFT_KEY), null);
  assert.equal(isAutosaveEnabled(storage), true);
});

test('keys are namespaced under keyholder: so they never collide with other apps', () => {
  assert.equal(AUTOSAVE_KEY, 'keyholder:autosave-enabled');
  assert.equal(DRAFT_KEY, 'keyholder:draft');
});
