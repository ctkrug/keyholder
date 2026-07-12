import { SECTIONS } from './schema.js';
import { createInitialState, buildDocument, buildMeta, applyDraft } from './model.js';
import { renderForm } from './form.js';
import { documentToHtml } from './preview.js';
import { exportPdf } from './pdf.js';
import { isAutosaveEnabled, setAutosaveEnabled, saveDraft, loadDraft, clearDraft } from './storage.js';

const EXPORT_FLASH_MS = 1400;

function init() {
  const storage = window.localStorage;
  const state = createInitialState(SECTIONS);
  const formEl = document.getElementById('checklist-form');
  const preview = document.getElementById('preview');
  const exportButton = document.getElementById('export-pdf');
  const clearButton = document.getElementById('clear-all');
  const exportStatus = document.getElementById('export-status');
  const autosaveToggle = document.getElementById('autosave-toggle');

  const currentDocument = () => buildDocument(SECTIONS, state);
  const currentMeta = () => buildMeta(state.basics);

  autosaveToggle.checked = isAutosaveEnabled(storage);
  if (autosaveToggle.checked) {
    const draft = loadDraft(storage);
    if (draft) applyDraft(SECTIONS, state, draft);
  }

  const update = () => {
    preview.innerHTML = documentToHtml(currentDocument(), currentMeta());
    if (autosaveToggle.checked) saveDraft(storage, state);
  };

  renderForm(formEl, SECTIONS, state, update);
  update();

  autosaveToggle.addEventListener('change', () => {
    setAutosaveEnabled(storage, autosaveToggle.checked);
    if (autosaveToggle.checked) saveDraft(storage, state);
  });

  exportButton.addEventListener('click', () => {
    exportButton.classList.add('btn--pressed');
    exportButton.disabled = true;
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
      setTimeout(() => {
        exportButton.classList.remove('btn--pressed');
        exportButton.disabled = false;
      }, EXPORT_FLASH_MS);
    }
  });

  clearButton.addEventListener('click', () => {
    if (!window.confirm('Clear the whole form? This cannot be undone.')) return;

    const fresh = createInitialState(SECTIONS);
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, fresh);
    clearDraft(storage);

    renderForm(formEl, SECTIONS, state, update);
    update();

    exportStatus.textContent = 'Form cleared.';
    exportStatus.classList.remove('status-line--success', 'status-line--error');
  });
}

document.addEventListener('DOMContentLoaded', init);
