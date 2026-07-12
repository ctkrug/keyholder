// Builds the form controls from the schema and binds them to the value state.
// The state object is the single source of truth: each control writes straight
// into its state slot on input and then calls onChange, which re-renders the
// preview (and autosaves). Repeatable sections manage their own add/remove.
//
// DOM-touching by nature, so it stays thin; the one piece of logic worth
// testing — stable, collision-free control ids — is the pure controlId helper.

import { emptyEntry } from './model.js';

export function controlId(sectionId, fieldId, index) {
  return index == null
    ? `f-${sectionId}-${fieldId}`
    : `f-${sectionId}-${index}-${fieldId}`;
}

function buildControl(section, field, entry, index, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'field';

  const id = controlId(section.id, field.id, index);
  const label = document.createElement('label');
  label.className = 'field__label';
  label.setAttribute('for', id);
  label.textContent = field.label;

  const isArea = field.type === 'textarea';
  const control = document.createElement(isArea ? 'textarea' : 'input');
  if (!isArea) control.type = 'text';
  control.id = id;
  control.name = id;
  control.className = 'field__control';
  control.value = entry[field.id] || '';
  if (isArea) control.rows = 2;
  if (field.placeholder) control.placeholder = field.placeholder;

  control.addEventListener('input', () => {
    entry[field.id] = control.value;
    onChange();
  });

  wrap.append(label, control);

  if (field.help) {
    const help = document.createElement('p');
    help.className = 'field__help';
    help.id = `${id}-help`;
    help.textContent = field.help;
    control.setAttribute('aria-describedby', help.id);
    wrap.append(help);
  }
  return wrap;
}

function buildEntry(section, entry, index, onChange, onRemove) {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'entry';

  const legend = document.createElement('legend');
  legend.className = 'entry__legend';
  const noun = section.repeatable.noun;
  legend.textContent = `${noun[0].toUpperCase()}${noun.slice(1)} ${index + 1}`;
  fieldset.append(legend);

  for (const field of section.fields) {
    fieldset.append(buildControl(section, field, entry, index, onChange));
  }

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'btn btn--ghost entry__remove';
  remove.textContent = 'Remove';
  remove.setAttribute('aria-label', `Remove ${legend.textContent}`);
  remove.addEventListener('click', () => onRemove(index));
  fieldset.append(remove);

  return fieldset;
}

function buildRepeatable(section, state, onChange) {
  const list = document.createElement('div');
  list.className = 'entries';

  const render = () => {
    list.replaceChildren();
    const entries = state[section.id];
    entries.forEach((entry, index) => {
      list.append(
        buildEntry(section, entry, index, onChange, (i) => {
          entries.splice(i, 1);
          render();
          onChange();
        }),
      );
    });
  };
  render();

  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'btn btn--secondary entries__add';
  add.textContent = section.repeatable.addLabel;
  add.addEventListener('click', () => {
    state[section.id].push(emptyEntry(section));
    render();
    onChange();
  });

  const group = document.createDocumentFragment();
  group.append(list, add);
  return group;
}

function buildSection(section, state, onChange) {
  const wrapper = document.createElement('section');
  wrapper.className = 'form-section';

  const heading = document.createElement('h2');
  heading.className = 'form-section__title';
  heading.textContent = section.title;
  wrapper.append(heading);

  if (section.description) {
    const desc = document.createElement('p');
    desc.className = 'form-section__desc';
    desc.textContent = section.description;
    wrapper.append(desc);
  }

  if (section.repeatable) {
    wrapper.append(buildRepeatable(section, state, onChange));
  } else {
    const entry = state[section.id];
    for (const field of section.fields) {
      wrapper.append(buildControl(section, field, entry, null, onChange));
    }
  }
  return wrapper;
}

// Render the whole form into `container`, wiring every control to `state`.
export function renderForm(container, sections, state, onChange) {
  container.replaceChildren();
  for (const section of sections) {
    container.append(buildSection(section, state, onChange));
  }
}
