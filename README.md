# Keyholder

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

## The wow moment

You fill in a short form and a clean, printable estate document builds itself live in a preview
pane as you type — then a banner confirms nothing you typed ever left the browser (verifiable
in devtools: zero network requests, ever).

## Planned features

- **Live preview pane** — the document renders as you fill in the form, so you always see the
  final output before you export it.
- **Structured checklist sections** — accounts & logins, financial accounts, insurance
  policies, subscriptions to cancel, physical assets & documents, pets & dependents,
  final wishes, and a free-form notes section.
- **PDF export** — one click, powered by [jsPDF](https://github.com/parallax/jsPDF), entirely
  in-browser.
- **Zero network verification banner** — a visible, honest confirmation (not a marketing claim)
  that nothing was sent anywhere, so you can check it yourself.
- **Local draft autosave** — optional save-to-`localStorage` so a reload doesn't lose your work
  (still 100% on-device, never synced).
- **Print-friendly layout** — the same document is legible printed directly from the browser,
  no PDF required.

## Stack

- Vanilla JavaScript (no framework, no build-time backend) — keeps the "nothing leaves the
  browser" claim easy to verify by reading the source.
- [jsPDF](https://github.com/parallax/jsPDF) for client-side PDF generation.
- Plain CSS, static HTML. Ships as a single static site — no server required.

## Status

Early scaffold. See [`docs/VISION.md`](docs/VISION.md) for the full design rationale and
[`docs/BACKLOG.md`](docs/BACKLOG.md) for the build plan.

## Development

```bash
npm install
npm test
```

Open `src/index.html` directly in a browser, or serve the `src/` directory with any static
file server.

## License

MIT — see [LICENSE](LICENSE).
