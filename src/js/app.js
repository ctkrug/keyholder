import { SECTIONS } from './schema.js';
import { createInitialState, buildDocument, buildMeta } from './model.js';
import { renderForm } from './form.js';
import { documentToHtml } from './preview.js';
import { exportPdf } from './pdf.js';

const EXPORT_FLASH_MS = 1400;

function init() {
  const state = createInitialState(SECTIONS);
  const formEl = document.getElementById('checklist-form');
  const preview = document.getElementById('preview');
  const exportButton = document.getElementById('export-pdf');
  const exportStatus = document.getElementById('export-status');

  const currentDocument = () => buildDocument(SECTIONS, state);
  const currentMeta = () => buildMeta(state.basics);

  const update = () => {
    preview.innerHTML = documentToHtml(currentDocument(), currentMeta());
  };

  renderForm(formEl, SECTIONS, state, update);
  update();

  exportButton.addEventListener('click', () => {
    exportButton.classList.add('btn--pressed');
    try {
      exportPdf(currentDocument(), currentMeta());
      exportStatus.textContent = 'PDF saved — check your downloads.';
      exportStatus.classList.remove('status-line--error');
      exportStatus.classList.add('status-line--success');
    } catch (error) {
      exportStatus.textContent = `Export failed: ${error.message}`;
      exportStatus.classList.remove('status-line--success');
      exportStatus.classList.add('status-line--error');
    } finally {
      setTimeout(() => exportButton.classList.remove('btn--pressed'), EXPORT_FLASH_MS);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
