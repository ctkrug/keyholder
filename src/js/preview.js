// Render the document model to the HTML shown in the live preview pane — the
// "sheet of paper" that is the app's hero. Pure string in, HTML string out, so
// it unit-tests without a DOM. app.js drops the result into the preview node's
// innerHTML; because every value passes through escapeHtml, nothing the user
// types can inject markup.

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Escape, then turn newlines into <br> so multi-line textarea values keep their
// shape in the rendered document.
function escapeMultiline(value) {
  return escapeHtml(value).replace(/\n/g, '<br />');
}

function fieldHtml(row) {
  const value = row.value.trim();
  const dd = value
    ? `<dd class="doc-field__value">${escapeMultiline(row.value)}</dd>`
    : '<dd class="doc-field__value is-empty" aria-label="not filled in"></dd>';
  return `<div class="doc-field"><dt class="doc-field__label">${escapeHtml(
    row.label,
  )}</dt>${dd}</div>`;
}

function groupHtml(group) {
  const fields = `<dl class="doc-fields">${group.rows.map(fieldHtml).join('')}</dl>`;
  if (!group.heading) return fields;
  return `<div class="doc-entry"><h4 class="doc-entry__title">${escapeHtml(
    group.heading,
  )}</h4>${fields}</div>`;
}

function sectionHtml(section) {
  const parts = [`<h3 class="doc-section__title">${escapeHtml(section.title)}</h3>`];
  if (section.description) {
    parts.push(`<p class="doc-section__desc">${escapeHtml(section.description)}</p>`);
  }
  if (section.empty) {
    parts.push(`<p class="doc-section__empty">${escapeHtml(section.empty)}</p>`);
  } else {
    parts.push(section.groups.map(groupHtml).join(''));
  }
  return `<section class="doc-section" aria-labelledby="sec-${escapeHtml(
    section.id,
  )}" id="sec-${escapeHtml(section.id)}">${parts.join('')}</section>`;
}

export function documentToHtml(doc, meta = {}) {
  const masthead = [];
  if (meta.title) {
    masthead.push(`<h2 class="doc__title">${escapeHtml(meta.title)}</h2>`);
  }
  if (meta.subtitle) {
    masthead.push(`<p class="doc__subtitle">${escapeHtml(meta.subtitle)}</p>`);
  }
  const header = masthead.length
    ? `<header class="doc__masthead">${masthead.join('')}</header>`
    : '';
  return `<article class="doc">${header}${doc.sections.map(sectionHtml).join('')}</article>`;
}
