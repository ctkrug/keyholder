// Vendors jsPDF and the app's two web fonts into src/vendor so the app never
// fetches them from a CDN at runtime. That keeps the "nothing leaves your
// browser" claim literal: even the library and the fonts are served from
// disk, not a third-party network request.
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const nodeModules = path.join(rootDir, 'node_modules');

function copyOne(source, dest) {
  if (!existsSync(source)) {
    console.warn(`copy-vendor: ${source} not found, skipping`);
    return;
  }
  mkdirSync(path.dirname(dest), { recursive: true });
  copyFileSync(source, dest);
  console.log(`copy-vendor: wrote ${dest}`);
}

copyOne(
  path.join(nodeModules, 'jspdf', 'dist', 'jspdf.umd.min.js'),
  path.join(rootDir, 'src', 'vendor', 'jspdf.umd.min.js'),
);

const fontsDestDir = path.join(rootDir, 'src', 'vendor', 'fonts');
const FONT_FILES = [
  ['@fontsource/fraunces', 'fraunces-latin-400-normal.woff2', 'fraunces-400.woff2'],
  ['@fontsource/fraunces', 'fraunces-latin-600-normal.woff2', 'fraunces-600.woff2'],
  ['@fontsource/fraunces', 'fraunces-latin-700-normal.woff2', 'fraunces-700.woff2'],
  ['@fontsource/inter', 'inter-latin-400-normal.woff2', 'inter-400.woff2'],
  ['@fontsource/inter', 'inter-latin-500-normal.woff2', 'inter-500.woff2'],
  ['@fontsource/inter', 'inter-latin-600-normal.woff2', 'inter-600.woff2'],
];
for (const [pkg, sourceName, destName] of FONT_FILES) {
  copyOne(
    path.join(nodeModules, pkg, 'files', sourceName),
    path.join(fontsDestDir, destName),
  );
}
