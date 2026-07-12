// Pure function: turns schema + form values into the plain-text document
// shown in the preview pane and handed to the PDF exporter. Kept free of DOM
// access so it's trivially unit-testable.
export function renderDocument(sections, values) {
  return sections
    .map((section) => {
      const lines = section.fields.map(
        (field) => `${field.label}: ${values[field.id] || ''}`,
      );
      return [section.title, ...lines].join('\n');
    })
    .join('\n\n');
}
