// Produces the deployable static site in site/ from the app in src/.
//
// Keyholder is a static, servable app, so the "landing page" is the app
// itself: this just copies src/ (HTML, CSS, JS modules, and the vendored
// jsPDF + fonts) verbatim into a clean site/ directory the publisher can
// serve from apps.charliekrug.com/keyholder/. All asset paths in the app are
// relative, so no rewriting is needed. Run it after `npm install` so the
// vendored assets exist to copy.
import { cpSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const srcDir = path.join(rootDir, 'src');
const siteDir = path.join(rootDir, 'site');

if (!existsSync(path.join(srcDir, 'vendor', 'jspdf.umd.min.js'))) {
  console.warn(
    'build-site: src/vendor is missing — run `npm install` first, or the ' +
      'built site will be missing jsPDF and its fonts.',
  );
}

rmSync(siteDir, { recursive: true, force: true });
cpSync(srcDir, siteDir, { recursive: true });
console.log(`build-site: copied src/ -> ${path.relative(rootDir, siteDir)}/`);
