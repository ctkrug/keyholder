// Pure transforms between the schema, the form's value state, and the
// structured "document model" that the preview and PDF both render. No DOM,
// no globals — everything here is a plain function over plain data, so the
// interesting logic is trivially unit-testable.
//
// Value state shape (namespaced by section id, so identical field ids in
// different sections never collide):
//   state[sectionId] = { fieldId: value }        // fixed section
//   state[sectionId] = [ { fieldId: value }, … ] // repeatable section

// A blank entry for a section's fields — every field present, every value ''.
export function emptyEntry(section) {
  const entry = {};
  for (const field of section.fields) entry[field.id] = '';
  return entry;
}

// The initial value state: fixed sections get one entry object, repeatable
// sections get a single blank entry so the form shows one row to fill.
export function createInitialState(sections) {
  const state = {};
  for (const section of sections) {
    state[section.id] = section.repeatable ? [emptyEntry(section)] : emptyEntry(section);
  }
  return state;
}

// True when every field in an entry is blank (ignoring surrounding whitespace).
export function entryIsEmpty(entry, fields) {
  return fields.every((field) => String(entry?.[field.id] ?? '').trim() === '');
}

function capitalize(word) {
  return word ? word[0].toUpperCase() + word.slice(1) : word;
}

function rowsFor(fields, entry) {
  return fields.map((field) => ({
    label: field.label,
    value: String(entry?.[field.id] ?? ''),
  }));
}

// Build the masthead ({ title, subtitle }) shown atop the preview and PDF from
// the basics section's entry, so the document reads as this person's checklist
// once they've filled in a name, rather than a generic template forever.
export function buildMeta(basics = {}) {
  const name = String(basics.fullName || '').trim();
  const prepared = String(basics.datePrepared || '').trim();
  return {
    title: name ? `${name}’s Keyholder Checklist` : 'Keyholder Checklist',
    subtitle: prepared
      ? `Prepared ${prepared}`
      : 'A guide for the people you trust, if something happens to me.',
  };
}

// Turn schema + value state into the document model consumed by every renderer.
// A section becomes { id, title, description, repeatable, groups, empty } where
// each group is { heading, rows: [{label, value}] }. Repeatable sections drop
// fully-blank entries and, when none remain, expose `empty: 'None listed'`.
export function buildDocument(sections, state) {
  const out = [];
  for (const section of sections) {
    const block = {
      id: section.id,
      title: section.title,
      description: section.description || '',
      repeatable: Boolean(section.repeatable),
      groups: [],
      empty: null,
    };

    if (section.repeatable) {
      const entries = Array.isArray(state?.[section.id]) ? state[section.id] : [];
      const filled = entries.filter((entry) => !entryIsEmpty(entry, section.fields));
      if (filled.length === 0) {
        block.empty = 'None listed';
      } else {
        block.groups = filled.map((entry, i) => ({
          heading: `${capitalize(section.repeatable.noun)} ${i + 1}`,
          rows: rowsFor(section.fields, entry),
        }));
      }
    } else {
      const entry = state?.[section.id] ?? {};
      block.groups = [{ heading: null, rows: rowsFor(section.fields, entry) }];
    }

    out.push(block);
  }
  return { sections: out };
}
