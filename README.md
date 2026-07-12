# Keyholder

**The estate checklist that never leaves your browser.**

▶ **Live demo:** [apps.charliekrug.com/keyholder](https://apps.charliekrug.com/keyholder/)

[![CI](https://github.com/ctkrug/keyholder/actions/workflows/ci.yml/badge.svg)](https://github.com/ctkrug/keyholder/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-informational.svg)](LICENSE)

Keyholder is a 100% client-side digital estate planning checklist. You fill in a short form,
watch a clean, printable "if something happens to me" document build itself live beside it, and
export it as a PDF. Not a single byte of what you type ever leaves your browser.

## Who it's for

Anyone who has thought "I should really write this down for my family" and stopped at "...but
where." You want to leave the people you trust a clear record of where the accounts, the money,
the insurance, and the keys are. You are not willing to create an account with a startup and
upload that record to its servers.

## Why it exists

Digital estate planning tools ask you to hand over the crown jewels: account lists, password
manager master passwords, safe combinations, life insurance policy numbers. Most do it through a
cloud account, a database, and a company that might not exist in ten years. That is the worst
possible threat model for a document whose entire job is concentrating the keys to your life in
one place.

Keyholder takes the opposite bet: no account, no server, no database. It is a static page that
runs entirely in your browser. Open devtools, watch the Network tab, and nothing is transmitted,
because there is nowhere for it to go. When you are done, you export a PDF and close the tab. The
only place your information ever exists is the file you saved.

This is not a privacy *policy*. It is an architectural fact you can verify yourself.

## Verify it yourself

Don't take the banner's word for it. Check it in about ten seconds:

1. Open the [live demo](https://apps.charliekrug.com/keyholder/) (or serve `src/` locally, see
   Development below).
2. Open devtools and go to the **Network** tab. Clear it, and enable "Disable cache" to be strict.
3. Fill in every field across every section: accounts, financial, insurance, all of it.
4. Click **Export PDF**.
5. Watch the Network tab. **Zero requests appear**, before, during, or after. The only entries
   you ever see are the page's own files loading once at the start (`index.html`, `style.css`,
   `app.js` and its modules, the vendored jsPDF bundle, and the self-hosted fonts). Nothing fires
   again as you type or export, because there is no code path that could: the form, the preview,
   and the PDF exporter are pure functions over in-memory state, and jsPDF's `.save()` writes
   straight to a browser download, not a network request.

## What's inside the checklist

A complete, opinionated set of sections, each supporting multiple entries where it makes sense
(more than one bank account, more than one policy):

- **The basics:** who the document is for and the first person to contact.
- **Accounts & logins:** every account someone needs to reach or close. It asks *where the
  password lives*, never the password itself, so the sheet is a map to your logins, not a copy.
- **Financial accounts:** banks, brokerages, and retirement accounts, plus who to contact.
- **Insurance policies:** life, home, auto, and health coverage that has to be claimed.
- **Subscriptions to cancel:** the recurring charges that keep draining an estate until someone
  stops them.
- **Physical assets & documents:** where the deed, the passports, and the spare keys actually are.
- **Pets & dependents:** who steps in, and the care instructions they will need.
- **Final wishes** and a **free-form notes** section for anything that didn't fit.

## Features

- **Live preview pane:** the document renders as you fill in the form, so you always see the
  final output before you export it.
- **Client-side PDF export:** one click, powered by [jsPDF](https://github.com/parallax/jsPDF),
  entirely in-browser. Long fields paginate cleanly instead of clipping at the page edge.
- **Zero-network verification banner:** a visible, honest confirmation you can check yourself, not
  a marketing claim.
- **Optional local draft autosave:** off by default. Switch it on and your progress is saved to
  this browser's `localStorage` so a reload doesn't lose your work, still fully on-device and
  never synced. Switching it back off clears the saved draft immediately.
- **Clear all:** wipes the form and any saved draft, behind an explicit confirmation.
- **Print-friendly layout:** the same document prints legibly straight from the browser, no PDF
  required.

## Stack

- Vanilla JavaScript, no framework and no build-time backend, so the "nothing leaves the browser"
  claim stays easy to verify by reading the source.
- [jsPDF](https://github.com/parallax/jsPDF) for client-side PDF generation, vendored into the
  repo (not loaded from a CDN) so even the library needs no network request at runtime.
- Plain CSS and static HTML. Ships as a single static site with no server component.

## Development

```bash
npm install    # also vendors jsPDF + fonts into src/vendor via postinstall
npm test       # node --test: pure-function unit tests, no browser needed
npm run lint   # eslint
```

Serve the `src/` directory with any static file server, for example `npx serve src` or
`python3 -m http.server --directory src`, then open it in a browser. Browsers block ES module
imports from a bare `file://` URL, so opening `src/index.html` directly won't load the app. It
needs to come from an actual origin, even a local one.

To produce the deployable static output in `site/`, run `npm run build:site`.

## License

MIT. See [LICENSE](LICENSE).

---

More of Charlie's projects: [apps.charliekrug.com](https://apps.charliekrug.com)
