// The checklist's structure as plain data. The form builder, the live-preview
// renderer, and the PDF exporter are all driven from this one source of truth,
// so adding a section or field here flows through the whole app with no other
// code change.
//
// Two kinds of section:
//   - Fixed:      a set of `fields` filled in once (e.g. Basics, Final wishes).
//   - Repeatable: `repeatable` is set; the user can add multiple entries, each
//                 with the section's `fields` (e.g. Accounts, Insurance).
//
// A field is `{ id, label, type, placeholder?, help? }` where `type` is
// 'text' or 'textarea'. `help` is guidance shown under the control; `placeholder`
// is an example. Nothing here is a secret store — labels deliberately avoid
// asking for live passwords or account numbers where that would be reckless.

export const SECTIONS = [
  {
    id: 'basics',
    title: 'The basics',
    description:
      'Who this document is for, and the first thing someone should do when they open it.',
    fields: [
      { id: 'fullName', label: 'Full legal name', type: 'text', placeholder: 'Jane Alexandra Doe' },
      { id: 'datePrepared', label: 'Date prepared', type: 'text', placeholder: 'July 2026' },
      {
        id: 'firstContact',
        label: 'First person to contact',
        type: 'text',
        placeholder: 'My sister, Mary Doe',
      },
      { id: 'firstContactPhone', label: 'Their phone number', type: 'text', placeholder: '(555) 010-1234' },
      {
        id: 'documentLocation',
        label: 'Where the signed original of this document is kept',
        type: 'text',
        help: 'The printed, signed copy — not this browser tab.',
        placeholder: 'Fireproof box in the hall closet',
      },
    ],
  },
  {
    id: 'accounts',
    title: 'Accounts & logins',
    description:
      'Online accounts someone may need to access or close. Never write a password here — ' +
      'point to where it lives instead.',
    repeatable: { noun: 'account', addLabel: 'Add an account' },
    fields: [
      { id: 'service', label: 'Service or website', type: 'text', placeholder: 'Gmail' },
      { id: 'username', label: 'Username or email', type: 'text', placeholder: 'jane@example.com' },
      {
        id: 'credentialLocation',
        label: 'Where the password is stored',
        type: 'text',
        help: 'e.g. "1Password", "written in the blue notebook" — not the password itself.',
        placeholder: '1Password vault',
      },
      {
        id: 'recovery',
        label: 'Two-factor or recovery method',
        type: 'text',
        placeholder: 'Codes in the safe; recovery phone is my cell',
      },
      { id: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Primary email — reset link for most other accounts.' },
    ],
  },
];
