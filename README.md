# Keyholder

[![CI](https://github.com/ctkrug/keyholder/actions/workflows/ci.yml/badge.svg)](https://github.com/ctkrug/keyholder/actions/workflows/ci.yml)

A 100% client-side digital estate checklist generator. Fill in a short form, watch a clean,
printable "if something happens to me" document build itself live in a preview pane, then
export it as a PDF — all without a single byte ever leaving your browser.

## Why

Digital estate planning tools ask you to hand over the crown jewels: account lists, password
manager master passwords, safe combinations, life insurance policy numbers. Most of them do
that through a cloud account, a database, and a company that might not exist in ten years.

Keyholder takes the opposite bet: no account, no server, no database. It's a static page that
runs entirely in your browser. Open devtools, watch the network tab — nothing is transmitted,
because there's nowhere for it to go. When you're done, you export a PDF and close the tab. The
only place your information ever exists is the file you saved.

This isn't a privacy *policy* — it's an architectural fact you can verify yourself.

## Verify it yourself

Don't take the banner's word for it — check in about ten seconds:

1. Open the deployed site (or serve `src/` locally — see Development below) in a browser.
2. Open devtools and go to the **Network** tab. Clear it, and enable "Disable cache" if you
   want to be strict about it.
3. Fill in every field across every section — accounts, financial, insurance, all of it.
4. Click **Export PDF**.
5. Look at the Network tab: **zero requests appear**, before, during, or after any of that.
   The only entries you'll ever see are the page's own files loading once at the very start
   (`index.html`, `style.css`, `app.js` and its modules, the vendored jsPDF bundle, and the two
   self-hosted fonts) — nothing fires again as you type or export, because there's no code path
   that could: the form, the preview, and the PDF exporter are pure functions over in-memory
   state, and jsPDF's `.save()` writes directly to a browser download, not a network request.

## The wow moment

You fill in a short form and a clean, printable estate document builds itself live in a preview
pane as you type — then a banner confirms nothing you typed ever left the browser (verifiable
in devtools: zero network requests, ever).

## Features

- **Live preview pane** — the document renders as you fill in the form, so you always see the
  final output before you export it.
- **Structured checklist sections** — accounts & logins, financial accounts, insurance
  policies, subscriptions to cancel, physical assets & documents, pets & dependents,
  final wishes, and a free-form notes section, each supporting multiple entries where it
  makes sense (more than one bank account, more than one policy...).
- **PDF export** — one click, powered by [jsPDF](https://github.com/parallax/jsPDF), entirely
  in-browser.
- **Zero network verification banner** — a visible, honest confirmation (not a marketing claim)
  that nothing was sent anywhere, so you can check it yourself.
- **Optional local draft autosave** — off by default; switch it on and your progress is saved to
  `localStorage` so a reload doesn't lose your work (still 100% on-device, never synced —
  switching it back off clears the saved draft immediately).
- **Clear all** — wipes the form and any saved draft, behind an explicit confirmation.
- **Print-friendly layout** — the same document is legible printed directly from the browser,
  no PDF required.

## Stack

- Vanilla JavaScript (no framework, no build-time backend) — keeps the "nothing leaves the
  browser" claim easy to verify by reading the source.
- [jsPDF](https://github.com/parallax/jsPDF) for client-side PDF generation.
- Plain CSS, static HTML. Ships as a single static site — no server required.

## Status

The core checklist is functional end-to-end: fill in the form, watch the live preview build the
document, export a PDF. See [`docs/VISION.md`](docs/VISION.md) for the full design rationale and
[`docs/BACKLOG.md`](docs/BACKLOG.md) for what's done and what's left.

## Development

```bash
npm install
npm test
```

Serve the `src/` directory with any static file server, e.g. `npx serve src` or
`python3 -m http.server --directory src`, then open it in a browser. Browsers block ES module
imports (`<script type="module">`) from a bare `file://` URL, so opening `src/index.html`
directly won't load the app — it needs to come from an actual origin, even a local one.

## License

MIT — see [LICENSE](LICENSE).
