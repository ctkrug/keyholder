# Vision

## The problem

If something happens to you, the people you leave behind need answers to some very unglamorous
questions fast: where do you bank, what subscriptions renew automatically and drain the estate,
who has power of attorney, where's the will, what happens to the dog. Today the options are a
notebook that goes stale, a shared spreadsheet nobody encrypts, or a "digital legacy" SaaS
product that asks you to create an account and upload your entire financial life to its
servers — a company that has its own risk of disappearing, getting acquired, or getting
breached.

That last option is the one being marketed hardest, and it's the one with the worst threat
model for exactly this use case: a document whose entire job is to concentrate the keys to
your life in one place. Centralizing that on a third party's server is the opposite of what
you want.

## Who it's for

Anyone who has thought "I should really write this down" and then stopped at "...but where."
Concretely: people who are willing to fill out a checklist and print or save a PDF, but who
will not create an account with a startup and upload account numbers, insurance policy details,
or safe combinations to it. That's a large, underserved slice — the tools that exist all assume
the opposite preference.

## The core idea

A static page. You fill in a form. A clean, printable document renders live in a preview pane
next to it, built entirely by JavaScript running in your tab. When you're satisfied, you export
it as a PDF, generated client-side, and the tab can be closed — nothing was ever stored or sent
anywhere, because the page never made a network request with your data, and by design *can't*:
there's no backend to send it to.

This isn't "we promise not to look at your data." It's "there is no server, so verify it
yourself in ten seconds in devtools."

## Key design decisions

- **No backend, ever.** Not "no backend for v1" — the architecture has no place to put one.
  Adding a server later would be a rewrite, not a feature flag, and that's deliberate: it keeps
  the promise credible instead of "currently true."
- **Vendored dependencies, not CDN links.** jsPDF is copied into the repo at build time rather
  than loaded from a CDN `<script>` tag, so even the *library* doesn't require a network request
  at runtime. The zero-network claim should hold for the whole page, not just the form data.
- **Plain-text/DOM rendering, not a framework.** The live preview is built from a pure function
  (schema + form values → text) with no framework runtime in between. Easy to read, easy to
  verify there's nothing hidden doing something with the data.
- **Optional local persistence only.** If autosave ships, it saves to `localStorage` on the same
  origin — still on-device, never synced, and clearly labeled as such.
- **Content quality is the actual product.** The checklist's sections and prompts need to be
  genuinely useful and complete (the kind of thing a lawyer or someone who's actually had to
  settle an estate would nod at), not a generic form. Careful content is as much the "wow" as
  the architecture.

## What "v1 done" looks like

- A full checklist covering: accounts & logins, financial accounts, insurance policies,
  subscriptions, physical documents & assets, pets & dependents, final wishes, and free-form
  notes.
- Live preview renders the complete document as the user types, with no perceptible lag.
- PDF export produces a legible, printable multi-page document with section headers.
- A visible, honest zero-network banner/confirmation, and the claim is actually true — verified
  by checking the browser's network panel during a full fill-and-export pass.
- Fully responsive: usable on a phone as well as a desktop, since people fill this out in odd
  moments.
- Deployed as a static site with relative asset paths, so it can be served from a subpath
  (`apps.charliekrug.com/keyholder`) with no server-side component.
