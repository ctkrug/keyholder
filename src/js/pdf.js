// The jsPDF driver: walks the styled instruction list from pdf-layout.js and
// paints it onto an A4 page in the paper-and-ink palette, wrapping long values
// and paginating so nothing is clipped at a page boundary. This is the only
// module that touches the vendored jsPDF global; everything upstream is pure.

import { documentToPdfLines } from './pdf-layout.js';

const INK = [36, 31, 24]; // --text
const MUTED = [107, 98, 85]; // --text-muted
const GREEN = [44, 74, 62]; // --accent-support

// pt -> mm, with a comfortable line-height factor.
const lineHeight = (pt) => pt * 0.3528 * 1.2;

const STYLES = {
  title: { size: 22, font: ['times', 'bold'], color: INK, top: 0, bottom: 1, indent: 0 },
  subtitle: { size: 11, font: ['times', 'italic'], color: MUTED, top: 1, bottom: 6, indent: 0 },
  section: { size: 15, font: ['times', 'bold'], color: GREEN, top: 6, bottom: 2, indent: 0, rule: true },
  description: { size: 9.5, font: ['times', 'italic'], color: MUTED, top: 0, bottom: 2, indent: 0 },
  entry: { size: 11, font: ['times', 'bold'], color: INK, top: 2.5, bottom: 1, indent: 5 },
  field: { size: 11, font: ['times', 'normal'], color: INK, top: 0, bottom: 1.5, indent: 5 },
  empty: { size: 11, font: ['times', 'italic'], color: MUTED, top: 1, bottom: 1.5, indent: 5 },
};

function resolveJsPDF() {
  const ctor = window.jspdf && window.jspdf.jsPDF;
  if (!ctor) throw new Error('jsPDF is not loaded — vendored library missing.');
  return ctor;
}

// Render the document model straight to a saved PDF file. `meta` supplies the
// masthead; `filename` overrides the download name.
export function exportPdf(doc, meta = {}, { filename = 'keyholder-document.pdf' } = {}) {
  const JsPDF = resolveJsPDF();
  const pdf = new JsPDF({ unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const bottomLimit = pageH - margin;

  let y = margin;
  const lines = documentToPdfLines(doc, meta);

  for (const line of lines) {
    const style = STYLES[line.style] || STYLES.field;
    pdf.setFont(...style.font);
    pdf.setFontSize(style.size);
    pdf.setTextColor(...style.color);

    const indent = style.indent || 0;
    const wrapped = pdf.splitTextToSize(line.text, pageW - margin * 2 - indent);
    const lh = lineHeight(style.size);

    y += style.top;
    if (y + wrapped.length * lh > bottomLimit) {
      pdf.addPage();
      y = margin;
    }
    for (const wrappedLine of wrapped) {
      pdf.text(wrappedLine, margin + indent, y, { baseline: 'top' });
      y += lh;
    }
    if (style.rule) {
      pdf.setDrawColor(...MUTED);
      pdf.setLineWidth(0.2);
      pdf.line(margin, y + 0.5, pageW - margin, y + 0.5);
      y += 1.5;
    }
    y += style.bottom;
  }

  stampFooters(pdf, pageW, pageH, margin);
  pdf.save(filename);
}

// A quiet footer on every page: the zero-network reminder and a page counter.
function stampFooters(pdf, pageW, pageH, margin) {
  const total = pdf.internal.getNumberOfPages();
  for (let page = 1; page <= total; page += 1) {
    pdf.setPage(page);
    pdf.setFont('times', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(...MUTED);
    pdf.text('Made with Keyholder — generated entirely in the browser.', margin, pageH - 8, {
      baseline: 'top',
    });
    pdf.text(`Page ${page} of ${total}`, pageW - margin, pageH - 8, {
      baseline: 'top',
      align: 'right',
    });
  }
}
