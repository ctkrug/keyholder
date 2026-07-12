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
  {
    id: 'financial',
    title: 'Financial accounts',
    description:
      'Banks, brokerages, and retirement accounts. Record how to reach them and who can help — ' +
      'not live account numbers or passwords.',
    repeatable: { noun: 'account', addLabel: 'Add an account' },
    fields: [
      { id: 'institution', label: 'Institution', type: 'text', placeholder: 'First National Bank' },
      {
        id: 'accountType',
        label: 'Account type',
        type: 'text',
        placeholder: 'Checking / savings / brokerage / 401(k)',
      },
      {
        id: 'access',
        label: 'How to access it, or who to contact',
        type: 'textarea',
        help: 'A branch, a phone number, an advisor — enough to start, without exposing the account.',
        placeholder: 'Advisor: Sam Lee, (555) 010-9000. Statements come by mail.',
      },
      { id: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Direct-deposit paycheck lands here.' },
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance policies',
    description: 'Life, home, auto, health, and any other coverage that may need to be claimed or cancelled.',
    repeatable: { noun: 'policy', addLabel: 'Add a policy' },
    fields: [
      { id: 'policyType', label: 'Policy type', type: 'text', placeholder: 'Term life' },
      { id: 'provider', label: 'Provider', type: 'text', placeholder: 'Acme Mutual' },
      { id: 'policyNumber', label: 'Policy number', type: 'text', placeholder: 'TL-4471902' },
      {
        id: 'agent',
        label: 'Agent or contact',
        type: 'text',
        placeholder: 'Dana Ruiz, (555) 010-7788',
      },
    ],
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions to cancel',
    description: 'Recurring charges that will keep draining the account until someone stops them.',
    repeatable: { noun: 'subscription', addLabel: 'Add a subscription' },
    fields: [
      { id: 'service', label: 'Service', type: 'text', placeholder: 'Streaming Plus' },
      { id: 'billing', label: 'Billing frequency & amount', type: 'text', placeholder: '$15.99 monthly' },
      {
        id: 'cancelNotes',
        label: 'How to cancel',
        type: 'textarea',
        placeholder: 'Cancel from the account page; no phone call needed.',
      },
    ],
  },
];
