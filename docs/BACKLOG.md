# Backlog

Epics and stories for the v1 build. Every story lists concrete, checkable acceptance criteria —
no "works well" vibes. Stories start unchecked and get marked `[x]` as BUILD runs land them; QA
runs attack the acceptance criteria directly.

## Epic 1 — The wow moment: live preview, PDF export, zero-network proof

The demo has to land before anything else gets built. This epic alone should be a complete,
shippable (if minimal) product.

- [x] **1.1 — Live preview renders the full checklist as you type**
  - Typing in any form field updates the preview pane's corresponding line within one input
    event (no submit button, no debounce lag perceptible to a human tester).
  - Preview reflects every section currently defined in `schema.js` — adding a section to the
    schema and reloading shows it in the preview with no other code change.
  - Leaving a field blank renders its label with an empty value, never `undefined` or `null`
    printed into the document.

- [x] **1.2 — PDF export produces a legible, multi-section document**
  - Clicking "Export PDF" downloads a `.pdf` file containing every section header and every
    filled field value present in the live preview at click time.
  - A checklist long enough to overflow one page (e.g. all sections filled with realistic
    sample text) paginates correctly — no clipped or overlapping text at a page boundary.
  - Export works with zero fields filled in (produces a PDF of empty section headers, not an
    error or a blank/corrupt file).

- [x] **1.3 — Zero-network confirmation is true, not just claimed**
  - A visible banner states that nothing typed is transmitted anywhere.
  - Opening the browser devtools Network tab, filling in every field, and exporting a PDF
    produces zero outgoing requests of any kind after the initial page load.
  - README documents the exact verification steps above so anyone can check it themselves.

- [x] **1.4 — Design polish: Epic 1 matches `docs/DESIGN.md`**
  - Layout matches the two-column desktop / stacked-mobile intent at 390px, 768px, and 1440px
    with no horizontal scroll and no dead empty space around the preview pane.
  - Fraunces/Inter are loaded and applied per the type pairing; the animated wordmark is present
    and respects `prefers-reduced-motion`.
  - Every interactive control (text inputs, Export PDF button) has themed hover, focus-visible,
    active, and disabled states — no unstyled native widgets.

## Epic 2 — Full checklist content

- [ ] **2.1 — Accounts & logins section**
  - Fields exist for at least: service name, username/email, where the credential is stored
    (e.g. "password manager," "written down in X"), and notes.
  - Section supports adding multiple entries (at least 3 without a layout break) since most
    people have more than one account to list.

- [ ] **2.2 — Financial accounts section**
  - Fields cover institution name, account type, and how to access it (contact/instructions),
    without ever asking for a live account number or password field labeled as such.
  - Renders correctly in both the live preview and the exported PDF.

- [ ] **2.3 — Insurance policies section**
  - Fields cover policy type (life, home, auto, etc.), provider, policy number, and
    agent/contact info.
  - At least two policy entries can be added and both appear in the preview and PDF.

- [ ] **2.4 — Subscriptions to cancel section**
  - Fields cover service name, billing frequency, and cancellation notes (e.g. "cancel via
    website," "call to cancel").
  - Empty subscription list renders a clean "None listed" line rather than an empty gap.

- [ ] **2.5 — Physical assets & important documents section**
  - Fields cover document/asset name, physical location, and any relevant safe/lockbox
    combination reference (stored as free text the user controls, not a structured secret
    field that implies extra protection the app doesn't provide).

- [ ] **2.6 — Pets & dependents, and final wishes section**
  - Pets/dependents: name, care instructions, and a designated contact.
  - Final wishes: a free-text area for burial/cremation preference, service preferences, and
    any other instructions, clearly separated from the legally-binding-will disclaimer.

- [ ] **2.7 — Free-form notes section**
  - A single open text area included in both preview and PDF output, positioned last in the
    document.

- [ ] **2.8 — Design polish: Epic 2 long-document handling**
  - A dedicated print stylesheet (`@media print`) produces clean pagination directly from the
    browser's own Print dialog, matching the PDF export's section order.
  - With every section populated with realistic multi-entry sample data, the page at 1440px and
    390px still has no overlapping text, no horizontal scroll, and readable spacing between
    sections.

## Epic 3 — Persistence, safety, and resilience

- [ ] **3.1 — Optional local autosave**
  - Autosave is off by default; an explicit toggle turns it on.
  - When on, form state persists to `localStorage` and survives a page reload; when off, a
    reload clears the form with no residual data written.
  - The zero-network banner/copy is updated to mention that autosave (if enabled) stays local,
    so the claim stays accurate rather than stale.

- [ ] **3.2 — Clear/reset flow with confirmation**
  - A "Clear all" control requires an explicit confirmation step (e.g. a confirm dialog or
    two-step button) before wiping form state and any autosaved `localStorage` entry.
  - After confirming, the preview pane returns to its empty state and no stale data remains in
    `localStorage`.

- [ ] **3.3 — Design polish: Epic 3 states**
  - Autosave toggle and Clear-all control both have designed hover/focus/active/disabled states
    consistent with `docs/DESIGN.md` tokens.
  - A designed empty state exists for the preview pane before any field has been touched
    (not a blank white/cream rectangle) and a designed success state briefly confirms a
    completed export.
