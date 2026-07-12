// Flatten the document model into an ordered list of styled "instructions"
// the PDF driver walks top to bottom. Keeping this pure (no jsPDF, no DOM)
// means the document's structure and ordering are unit-tested; pdf.js only
// owns font metrics, wrapping, and pagination.
//
// Each instruction is { style, text } where style is one of:
//   title | subtitle | section | description | entry | field | empty

function fieldText(row) {
  const value = row.value.trim();
  return value ? `${row.label}: ${value}` : `${row.label}:`;
}

export function documentToPdfLines(doc, meta = {}) {
  const lines = [];
  if (meta.title) lines.push({ style: 'title', text: meta.title });
  if (meta.subtitle) lines.push({ style: 'subtitle', text: meta.subtitle });

  for (const section of doc.sections) {
    lines.push({ style: 'section', text: section.title });
    if (section.description) {
      lines.push({ style: 'description', text: section.description });
    }
    if (section.empty) {
      lines.push({ style: 'empty', text: section.empty });
      continue;
    }
    for (const group of section.groups) {
      if (group.heading) lines.push({ style: 'entry', text: group.heading });
      for (const row of group.rows) {
        lines.push({ style: 'field', text: fieldText(row) });
      }
    }
  }

  return lines;
}
