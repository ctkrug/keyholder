// pdf.js is the only module that touches the vendored jsPDF global, so it's
// exercised here against a minimal fake that implements just the jsPDF calls
// pdf.js makes (font/color state, splitTextToSize wrapping, page management,
// text/line drawing). This lets the pagination logic run under `node --test`
// without a browser or the real jsPDF bundle.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exportPdf } from '../src/js/pdf.js';

class FakeJsPDF {
  constructor() {
    this.pageWidth = 210;
    this.pageHeight = 297;
    this.currentPage = 1;
    this.totalPages = 1;
    this.currentFontSize = 12;
    this.calls = [];
    this.savedFilename = null;
    this.internal = {
      pageSize: {
        getWidth: () => this.pageWidth,
        getHeight: () => this.pageHeight,
      },
      getNumberOfPages: () => this.totalPages,
    };
    FakeJsPDF.instances.push(this);
  }

  setFont() {}

  setFontSize(size) {
    this.currentFontSize = size;
  }

  setTextColor() {}

  setDrawColor() {}

  setLineWidth() {}

  // A rough but consistent word-wrap so long strings reliably produce many
  // lines, without depending on real font metrics.
  splitTextToSize(text, maxWidth) {
    const charWidthMm = this.currentFontSize * 0.5 * 0.352778;
    const maxChars = Math.max(1, Math.floor(maxWidth / charWidthMm));
    const words = String(text).split(' ');
    const lines = [];
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length > maxChars && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  }

  addPage() {
    this.totalPages += 1;
    this.currentPage = this.totalPages;
  }

  setPage(n) {
    this.currentPage = n;
  }

  text(str, x, y, opts) {
    this.calls.push({ type: 'text', page: this.currentPage, str, x, y, opts });
  }

  line(x1, y1, x2, y2) {
    this.calls.push({ type: 'line', page: this.currentPage, x1, y1, x2, y2 });
  }

  save(filename) {
    this.savedFilename = filename;
  }
}
FakeJsPDF.instances = [];

function withFakeJsPdf(run) {
  FakeJsPDF.instances.length = 0;
  globalThis.window = { jspdf: { jsPDF: FakeJsPDF } };
  try {
    run();
  } finally {
    delete globalThis.window;
  }
  return FakeJsPDF.instances.at(-1);
}

test('a single very long field paginates across pages instead of overflowing off the bottom', () => {
  const doc = {
    sections: [
      {
        title: 'Notes',
        description: '',
        empty: null,
        groups: [
          {
            heading: null,
            rows: [{ label: 'Details', value: 'lorem ipsum dolor sit amet '.repeat(300) }],
          },
        ],
      },
    ],
  };

  const pdf = withFakeJsPdf(() => exportPdf(doc, { title: 'Test', subtitle: '' }));

  const margin = 18;
  const bottomLimit = pdf.pageHeight - margin;

  assert.ok(pdf.totalPages > 1, 'expected the long field to overflow onto additional pages');

  // Footers are deliberately stamped closer to the physical page edge than
  // the body content margin (see stampFooters in pdf.js) — exclude them.
  const textCalls = pdf.calls.filter((c) => c.type === 'text' && !c.str.startsWith('Made with Keyholder') && !c.str.startsWith('Page '));
  for (const call of textCalls) {
    assert.ok(
      call.y >= margin - 0.01 && call.y <= bottomLimit + 0.01,
      `line drawn at y=${call.y} on page ${call.page} falls outside the printable area`,
    );
  }

  // Pagination should pack lines densely, not break a fresh page for every
  // single line — otherwise a bug that page-breaks far too eagerly would
  // still satisfy the bounds check above while producing hundreds of pages.
  const linesPerPage = {};
  for (const call of textCalls) linesPerPage[call.page] = (linesPerPage[call.page] || 0) + 1;
  const fieldLineHeight = 11 * 0.3528 * 1.2;
  const capacity = Math.floor((bottomLimit - margin) / fieldLineHeight);
  const fullestPage = Math.max(...Object.values(linesPerPage));
  assert.ok(
    fullestPage > capacity * 0.5,
    `expected a densely packed page (~${capacity} lines), fullest page only had ${fullestPage}`,
  );
});

test('saves the requested filename and stamps a footer on every page', () => {
  const doc = { sections: [{ title: 'Notes', description: '', empty: 'None listed', groups: [] }] };

  const pdf = withFakeJsPdf(() => exportPdf(doc, { title: 'Test' }, { filename: 'my-checklist.pdf' }));

  assert.equal(pdf.savedFilename, 'my-checklist.pdf');
  const footerCalls = pdf.calls.filter((c) => c.type === 'text' && c.str.startsWith('Made with Keyholder'));
  assert.equal(footerCalls.length, pdf.totalPages);
});
