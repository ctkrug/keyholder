// Vendors jsPDF into src/vendor so the app never fetches it from a CDN at
// runtime. That keeps the "nothing leaves your browser" claim literal: even
// the library itself is served from disk, not a third-party network request.
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(rootDir, 'node_modules', 'jspdf', 'dist', 'jspdf.umd.min.js');
const destDir = path.join(rootDir, 'src', 'vendor');
const dest = path.join(destDir, 'jspdf.umd.min.js');

if (!existsSync(source)) {
  console.warn(`copy-vendor: ${source} not found, skipping`);
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(source, dest);
console.log(`copy-vendor: wrote ${dest}`);
