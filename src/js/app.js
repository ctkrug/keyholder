import { SECTIONS } from './schema.js';
import { renderDocument } from './render.js';
import { exportPdf } from './pdf.js';

function readValues(form) {
  const values = {};
  for (const section of SECTIONS) {
    for (const field of section.fields) {
      const input = form.elements.namedItem(field.id);
      values[field.id] = input ? input.value : '';
    }
  }
  return values;
}

function init() {
  const form = document.getElementById('checklist-form');
  const preview = document.getElementById('preview');
  const exportButton = document.getElementById('export-pdf');

  const update = () => {
    preview.textContent = renderDocument(SECTIONS, readValues(form));
  };

  form.addEventListener('input', update);
  exportButton.addEventListener('click', () => {
    exportPdf(renderDocument(SECTIONS, readValues(form)));
  });

  update();
}

document.addEventListener('DOMContentLoaded', init);
