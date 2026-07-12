// Serialize the document model to plain text. Kept separate from the HTML and
// PDF renderers so the same model can be turned into a copyable/text form and
// unit-tested without a DOM. `meta` supplies the masthead ({ title, subtitle }).

function rowLine(row, indent) {
  const value = row.value.trim();
  return `${indent}${row.label}: ${value}`;
}

export function documentToText(doc, meta = {}) {
  const lines = [];
  if (meta.title) lines.push(meta.title);
  if (meta.subtitle) lines.push(meta.subtitle);
  if (lines.length) lines.push('='.repeat(Math.max(meta.title?.length || 0, 12)), '');

  doc.sections.forEach((section, i) => {
    if (i > 0) lines.push('');
    lines.push(section.title.toUpperCase());
    if (section.description) lines.push(section.description);

    if (section.empty) {
      lines.push(`  ${section.empty}`);
      return;
    }

    section.groups.forEach((group, gi) => {
      if (group.heading) {
        if (gi > 0) lines.push('');
        lines.push(`  ${group.heading}`);
        group.rows.forEach((row) => lines.push(rowLine(row, '    ')));
      } else {
        group.rows.forEach((row) => lines.push(rowLine(row, '  ')));
      }
    });
  });

  return lines.join('\n');
}
