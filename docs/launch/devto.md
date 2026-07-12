---
title: "I built a digital estate checklist that never makes a network request"
published: false
tags: javascript, webdev, privacy, showdev
---

If something happens to you, the people you leave behind need answers fast: where do you bank,
which subscriptions auto-renew and drain the estate, where is the will, who takes the dog. The
tools that exist for this mostly want you to create an account and upload the answers to their
servers. For a document whose entire job is concentrating the keys to your life in one place,
that is the worst threat model I can think of.

So I built [Keyholder](https://apps.charliekrug.com/keyholder/): a checklist you fill in, watch
build itself live as a printable document, and export as a PDF. Nothing you type ever leaves the
browser, and you can prove it in devtools. Here are the two decisions that made it interesting to
build.

## 1. Zero-network as an architectural fact, not a promise

Anyone can write "we respect your privacy" in a footer. I wanted a claim you could verify in ten
seconds, so I made "no network request with your data" a property of the architecture rather than
a policy.

There is no `fetch` and no `XMLHttpRequest` anywhere in the source. The whole pipeline is pure
functions over in-memory state: a schema object describes the sections and fields, `model.js`
turns schema plus form values into a document model, and the preview and PDF are just two
renderers of that same model. The PDF export uses jsPDF's `.save()`, which writes straight to a
browser download.

The subtle part was the dependencies. A vendored library still counts: if the page pulled jsPDF
or its fonts from a CDN at runtime, the "nothing leaves your browser" claim would be false for
anyone watching the Network tab. So a small `postinstall` script copies jsPDF and the two woff2
font files out of `node_modules` and into `src/vendor`, and the page references them locally.
Load the app, open the Network tab, fill in every field, export the PDF, and you see exactly zero
requests after the initial page load. That is the whole pitch, and it holds up because there is
no code path that could break it.

## 2. A pure core you can test without a browser

Because the interesting logic is pure, I could test the entire document pipeline with `node
--test` and no jsdom. `schema.js` is the single source of truth; `model.js`, `preview.js`, and
`pdf-layout.js` are pure transforms; `pdf.js` is the only module that touches jsPDF.

To test the PDF layout without a real PDF engine, I wrote a roughly 20-line fake that implements
only the jsPDF calls the driver actually makes (`setFont`, `splitTextToSize`, `text`, `addPage`,
and a few getters). That fake caught a real bug. My first pagination pass added a new page once
per instruction block, which is fine until one field is longer than a whole page. A giant
free-form note would then run right off the bottom margin. The fix was to paginate per wrapped
line instead of per block, and the test that proves it feeds in a 2000-character value and asserts
no line is ever drawn below the page limit.

The state shape had one more trap worth mentioning. State is namespaced by section id, so the
field id `notes` in the Accounts section never collides with `notes` in the Financial section.
And because the optional autosave writes to `localStorage`, a draft saved under an older schema
could be any shape at all when it comes back. `sanitizeEntry` rebuilds every loaded entry from a
blank template and copies over only known string fields, so a stale or corrupted draft degrades to
a blank form instead of corrupting the live state.

## What I would do differently

The content is really the product. The section prompts (asking for *where the password lives*
rather than the password, nudging people toward subscriptions they forget) took as much thought as
the code, and I would spend even more time there. I would also consider a plain-text export
alongside the PDF, though I left it out to keep the surface small.

Code is [on GitHub](https://github.com/ctkrug/keyholder), MIT licensed, and the live app is at
[apps.charliekrug.com/keyholder](https://apps.charliekrug.com/keyholder/). If you find a way to
make it send a single byte anywhere, I want to hear about it.
