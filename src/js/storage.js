// Optional local-only draft persistence. Every function takes a `storage`
// argument (anything shaped like the Web Storage API: getItem/setItem/
// removeItem) rather than reaching for `window.localStorage` directly, so
// this stays a pure, DOM-free module that unit-tests with a plain fake.
//
// Two keys: whether autosave is turned on at all, and the draft itself.
// Autosave defaults to off — nothing is written to localStorage unless the
// user opts in.

export const AUTOSAVE_KEY = 'keyholder:autosave-enabled';
export const DRAFT_KEY = 'keyholder:draft';

export function isAutosaveEnabled(storage) {
  return storage.getItem(AUTOSAVE_KEY) === 'true';
}

// Turning autosave off always clears any existing draft, so no residual
// data survives once the user has opted back out.
export function setAutosaveEnabled(storage, enabled) {
  if (enabled) {
    storage.setItem(AUTOSAVE_KEY, 'true');
  } else {
    storage.removeItem(AUTOSAVE_KEY);
    storage.removeItem(DRAFT_KEY);
  }
}

export function saveDraft(storage, state) {
  storage.setItem(DRAFT_KEY, JSON.stringify(state));
}

export function clearDraft(storage) {
  storage.removeItem(DRAFT_KEY);
}

// Returns the parsed draft, or null if there is none or it's unreadable
// (corrupt JSON, wiped by another tab, browser storage quirks). A bad draft
// falling back to a blank form is the correct behavior here, not a bug to
// surface — there is no invariant to protect beyond "don't crash the page."
export function loadDraft(storage) {
  const raw = storage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}
