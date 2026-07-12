// Thin wrapper around the vendored jsPDF UMD global. Isolated here so the
// rest of the app never touches window.jspdf directly.
export function exportPdf(text, filename = 'keyholder-document.pdf') {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 15, 20);
  doc.save(filename);
}
